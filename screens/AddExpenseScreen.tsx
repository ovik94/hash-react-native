import React, { FC, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useForm, useWatch } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { Button,
  Icon,
  IconProps,
  Layout,
  SelectItem,
  Spinner,
  Text } from '@ui-kitten/components';
import FormSelect from '../components/form-controls/FormSelect';
import FormTextInput from '../components/form-controls/FormTextInput';
import Colors from '../constants/Colors';
import useStores from '../hooks/useStores';
import { Categories } from '../stores/CounterpartiesStore';
import { ICategory } from '../stores/ExpensesStore';

type FormData = {
  category: string;
  sum: string;
  comment?: string;
  counterparty?: string;
};

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  button: {
    marginTop: 32
  },
  indicator: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.light.tabIconDefault
  }
});

const LoadingIndicator = (props: IconProps) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" status="basic" />
  </View>
);

const CounterpartyCategories = {
  salary: 'service',
  kitchen: 'provider',
  beer: 'provider',
  marketing: 'provider',
  household: 'provider'
};

const AddExpenseScreen: FC = ({ navigation, route }: any) => {
  const {
    counterpartiesStore: {
      fetchRoleCounterparties,
      roleCounterparties
    },
    expensesStore: { addExpense, screenMessage }
  } = useStores();
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const category = useWatch({
    control,
    name: 'category'
  });

  const type = route?.params?.type;

  // @ts-ignore
  const counterpartyType = CounterpartyCategories[category?.id];

  useEffect(() => {
    if (counterpartyType) {
      fetchRoleCounterparties(counterpartyType);
    }
  }, [counterpartyType]);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    addExpense(data, () => navigation.goBack(), type)
      .catch(() => setLoading(false));
  };

  const renderCategoryItem = (item: ICategory) => (
    <SelectItem
      accessoryLeft={<Icon style={styles.categoryIcon} name={item.icon} />}
      title={item.title}
      key={item.id}
    />
  );

  const renderCategoryValue = (data: ICategory) => (
    <View>
      <Icon style={styles.categoryIcon} name={data.icon} />
      <Text style={{ left: 32, top: 4, position: 'absolute' }}>{data.title}</Text>
    </View>
  );

  const categoryOptions = Categories.map(item => ({ value: item, label: item.title }));
  const counterpartyOptions = useMemo(() => roleCounterparties
    .map(item => ({ value: item.name, label: item.name })), [roleCounterparties]);

  return (
    <Layout style={styles.container}>
      <FormSelect
        items={categoryOptions}
        renderItem={renderCategoryItem}
        renderValue={renderCategoryValue}
        name="category"
        label="Категория расхода"
        placeholder="Имя"
        error={errors.category}
        control={control}
        disabled={loading}
        required
      />
      <FormTextInput
        name="sum"
        label="Сумма"
        placeholder="Введите сумму"
        keyboardType="decimal-pad"
        control={control}
        error={errors.sum}
        disabled={loading}
        required
      />

      {counterpartyType && (
        <FormSelect
          items={counterpartyOptions}
          name="counterparty"
          label="Контрагент"
          placeholder="Контрагент"
          error={errors.counterparty}
          control={control}
          disabled={loading}
        />
      )}

      <FormTextInput
        name="comment"
        label="Комментарий"
        placeholder="Введите комментарий"
        control={control}
        error={errors.comment}
        disabled={loading}
      />

      {!!screenMessage && <Text status="danger">{screenMessage}</Text>}

      <Button
        style={styles.button}
        onPress={handleSubmit(onSubmit)}
        accessoryLeft={loading ? LoadingIndicator : undefined}
      >
        Добавить
      </Button>
    </Layout>
  );
};

export default observer(AddExpenseScreen);
