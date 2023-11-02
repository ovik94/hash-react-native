import React, { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { ViewStyle, StyleProp } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import FormDatePicker from '../../components/form-controls/FormDatePicker';
import FormSelect from '../../components/form-controls/FormSelect';
import dateFormatter from '../../components/utils/dateFormatter';
import Styles from '../../constants/Styles';
import { IStepProps } from './AddDailyReportScreen';
import useStores from "../../hooks/useStores";
import { observer } from "mobx-react-lite";

type FormData = {
  date: string;
  adminName: string;
};

const InfoStep = ({ onNext, data, setData }: IStepProps) => {
  const { counterpartiesStore: { fetchUsers, users } } = useStores();

  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      adminName: data?.adminName
    }
  });

  useEffect(() => {
    if (!users) {
      fetchUsers();
    }
  }, [users]);

  const onSubmit = (newData: FormData) => {
    onNext();
    setData({ ...newData, date: dateFormatter(newData.date) });
  };

  const adminList = useMemo(() => users ? users
    .filter(user => user.role === 'admin')
    .map(user => ({ value: user.name, label: user.name })) : [], [users]);

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent}>
        <Text category="h5" style={{ marginBottom: 16 }}>Выберите администратора и дату</Text>
        <FormSelect
          items={adminList}
          name="adminName"
          label="Администратор"
          placeholder="Имя"
          error={errors.adminName}
          control={control}
          required
        />

        <FormDatePicker
          name="date"
          label="Дата"
          control={control}
          error={errors.date}
        />
      </Layout>
      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button appearance="outline" disabled style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Назад
        </Button>
        <Button onPress={handleSubmit(onSubmit)} style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Далее
        </Button>
      </Layout>
    </Layout>
  );
}

export default observer(InfoStep);
