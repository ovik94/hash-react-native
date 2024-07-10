import React, { FC, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import { useForm, useWatch } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Button,
  Icon,
  IconProps,
  Layout,
  SelectItem,
  Spinner,
  Text,
} from "@ui-kitten/components";
import { FormSelect, FormTextInput } from "../components";
import Colors from "../constants/Colors";
import useStores from "../hooks/useStores";
import { ExpenseCategories, ICategory } from "../stores/ExpensesStore";
import { ISelectItem } from "types";

type FormData = {
  category: string;
  sum: string;
  comment?: string;
  counterparty?: string;
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  button: {
    marginTop: 32,
  },
  indicator: {
    justifyContent: "center",
    alignItems: "center",
  },
  categoryIcon: {
    height: 24,
    width: 24,
    tintColor: Colors.light.tabIconDefault,
  },
});

const LoadingIndicator = (props: IconProps) => (
  <View style={[props.style, styles.indicator]}>
    <Spinner size="small" status="basic" />
  </View>
);

const AddExpenseScreen: FC = ({ navigation, route }: any) => {
  const {
    counterpartiesStore: { fetchCounterparties, counterparties },
    expensesStore: { addExpense, screenMessage },
  } = useStores();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);

  const category = useWatch<ICategory>({
    // @ts-ignore
    control,
    name: "category",
  });

  const type = route?.params?.type;

  const categoryCounterparties = useMemo(() => {
    if (!category || !counterparties || !category.counterpartyType) {
      return null;
    }

    return counterparties.filter(
      (counterparty) => counterparty.type === category.counterpartyType
    );
  }, [counterparties, category]);

  useEffect(() => {
    if (!counterparties) {
      fetchCounterparties();
    }
  }, [counterparties]);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    addExpense(data, () => navigation.goBack(), type);
  };

  const renderCategoryItem = (item: ISelectItem<ICategory>) => (
    <SelectItem
      accessoryLeft={
        <Icon style={styles.categoryIcon} name={item.value.icon} />
      }
      title={item.value.title}
      key={item.value.title}
    />
  );

  const renderCategoryValue = (data: ICategory) => (
    <View>
      <Icon style={styles.categoryIcon} name={data.icon} />
      <Text style={{ left: 32, top: 4, position: "absolute" }}>
        {data.title}
      </Text>
    </View>
  );

  const categoryOptions = ExpenseCategories.map((item) => ({
    value: item,
    label: item.title,
  }));

  const counterpartyOptions = useMemo(
    () =>
      (categoryCounterparties || []).map((item) => ({
        value: item.name,
        label: item.name,
      })),
    [categoryCounterparties]
  );

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
        type="decimal-pad"
        pattern={/^\d*(\.\d{0,2})?$/}
        control={control}
        error={errors.sum}
        disabled={loading}
        required
      />

      {categoryCounterparties && (
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
