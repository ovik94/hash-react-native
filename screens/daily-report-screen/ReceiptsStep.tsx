import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { ViewStyle, StyleProp } from 'react-native';
import { Button, Layout, Text } from '@ui-kitten/components';
import FormTextInput from '../../components/form-controls/FormTextInput';
import { formatAmountString } from '../../components/utils/formatAmountString';
import Styles from '../../constants/Styles';
import { IStepProps } from './AddDailyReportScreen';

type FormData = {
  ipCash: string;
  ipAcquiring: string;
  oooCash: string;
  oooAcquiring: string;
  totalSum: string;
  yandex: string;
};

export default function ReceiptsStep({ onNext, onPrevious, data, setData }: IStepProps) {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormData>({
    defaultValues: {
      ipCash: data?.ipCash || undefined,
      ipAcquiring: data?.ipAcquiring || undefined,
      oooCash: data?.oooCash || undefined,
      oooAcquiring: data?.oooAcquiring || undefined,
      yandex: data?.yandex || undefined,
      totalSum: String(
        Number(data?.ipCash || '0') +
        Number(data?.ipAcquiring || '0') +
        Number(data?.oooCash || '0') +
        Number(data?.oooAcquiring || '0') +
        Number(data?.yandex || '0')
      ) || '0'
    }
  });

  const onSubmit = (newData: FormData) => {
    onNext();
    setData(newData);
  };

  const ipCashValue = useWatch({ control, name: 'ipCash' });
  const ipAcquiringValue = useWatch({ control, name: 'ipAcquiring' });
  const oooCashValue = useWatch({ control, name: 'oooCash' });
  const oooAcquiringValue = useWatch({ control, name: 'oooAcquiring' });
  const yandexValue = useWatch({ control, name: 'yandex' });
  const totalSumValue = useWatch({ control, name: 'totalSum' });

  useEffect(() => {
    const totalSum = Number(ipCashValue || '0') +
      Number(ipAcquiringValue || '0') +
      Number(oooCashValue || '0') +
      Number(oooAcquiringValue || '0') +
      Number(yandexValue || '0');
    setValue('totalSum', String(totalSum.toFixed(2)));
  }, [ipCashValue, ipAcquiringValue, oooCashValue, oooAcquiringValue, yandexValue]);

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent}>
        <Text category="h5">Выручка по подразделениям</Text>
        <Layout style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 32 }}>
          <Layout style={{ width: '50%', paddingRight: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>ИП Багдасарян Р.С</Text>
            <FormTextInput
              name="ipCash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              error={errors.ipCash}
              required
            />

            <FormTextInput
              name="ipAcquiring"
              label="Эквайринг"
              control={control}
              error={errors.ipAcquiring}
              type="decimal-pad"
              required
            />
          </Layout>
          <Layout style={{ width: '50%', paddingLeft: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>ООО ХашЛаваш</Text>
            <FormTextInput
              name="oooCash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              error={errors.oooCash}
              required
            />

            <FormTextInput
              name="oooAcquiring"
              label="Эквайринг"
              control={control}
              error={errors.oooAcquiring}
              type="decimal-pad"
              required
            />
          </Layout>
        </Layout>

        <Layout style={{ width: '50%', marginTop: 16 }}>
          <Text style={{ fontWeight: 'bold' }}>Яндекс.Еда и Деливери</Text>
          <FormTextInput
            name="yandex"
            label="Выручка"
            control={control}
            type="decimal-pad"
            error={errors.yandex}
          />
        </Layout>

        <Layout style={{ marginTop: 16 }}>
          <Text category="label" style={{ opacity: 0.7, marginBottom: 4 }}>Общая выручка</Text>
          <Text category="h5" style={{ fontWeight: 'bold' }}>{formatAmountString(totalSumValue)}</Text>
        </Layout>
      </Layout>

      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button onPress={onPrevious} appearance="outline" style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Назад
        </Button>
        <Button onPress={handleSubmit(onSubmit)} style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Далее
        </Button>
      </Layout>
    </Layout>
  );
}
