import React  from 'react';
import { useForm } from "react-hook-form";
import { ViewStyle, StyleProp } from 'react-native';
import FormDatePicker from "../../components/form-controls/FormDatePicker";
import FormSelect from "../../components/form-controls/FormSelect";
import Styles from "../../constants/Styles";
import dateFormatter from "../../components/utils/dateFormatter";
import { IStepProps } from "./AddDailyReportScreen";
import { Button, Layout, Text } from "@ui-kitten/components";

type FormData = {
  date: string;
  adminName: string;
};

const SelectOptions = [
  { label: 'Варя', value: 'Варя' },
  { label: 'Алина', value: 'Алина' },
  { label: 'Ариша', value: 'Ариша' },
  { label: 'Алена', value: 'Алена' }
];

export default function InfoStep({ onNext, data, setData }: IStepProps) {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      adminName: data?.adminName
    }
  });

  const onSubmit = (data: FormData) => {
    onNext();
    setData({ ...data, date: dateFormatter(data.date) })
  }

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent}>
        <Text category="h5" style={{ marginBottom: 16 }}>Выберите администратора и дату</Text>
        <FormSelect
          items={SelectOptions}
          name="adminName"
          label="Администратор"
          placeholder='Имя'
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
        <Button appearance='outline' disabled style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Назад
        </Button>
        <Button onPress={handleSubmit(onSubmit)} style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Далее
        </Button>
      </Layout>
    </Layout>
  );
}
