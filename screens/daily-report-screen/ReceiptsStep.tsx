import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ViewStyle, StyleProp, View } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import formatAmountString from "../../components/utils/formatAmountString";
import Styles from "../../constants/Styles";
import { IStepProps } from "./AddDailyReportScreen";
import { FormDatePicker, FormTextInput } from "../../components";
import useStores from "../../hooks/useStores";

type FormData = {
  adminName: string;
  date: string | Date;
  ipCash: string;
  ipAcquiring: string;
  oooCash: string;
  oooAcquiring: string;
  totalSum: string;
  yandex: string;
};

const dateTransform = (date: string) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export default function ReceiptsStep({ onNext, data, setData }: IStepProps) {
  const {
    userStore: { user },
  } = useStores();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      adminName: data.adminName || user.name,
      date:
        data?.date && typeof data?.date === "string"
          ? new Date(dateTransform(data?.date))
          : new Date(),
      ipCash: data?.ipCash || undefined,
      ipAcquiring: data?.ipAcquiring || undefined,
      oooCash: data?.oooCash || undefined,
      oooAcquiring: data?.oooAcquiring || undefined,
      yandex: data?.yandex || undefined,
      totalSum:
        String(
          Number(data?.ipCash || "0") +
            Number(data?.ipAcquiring || "0") +
            Number(data?.oooCash || "0") +
            Number(data?.oooAcquiring || "0") +
            Number(data?.yandex || "0")
        ) || "0",
    },
  });

  const onSubmit = (newData: FormData) => {
    onNext();
    setData(newData);
  };

  const adminName = useWatch({ control, name: "adminName" });
  const ipCashValue = useWatch({ control, name: "ipCash" });
  const ipAcquiringValue = useWatch({ control, name: "ipAcquiring" });
  const oooCashValue = useWatch({ control, name: "oooCash" });
  const oooAcquiringValue = useWatch({ control, name: "oooAcquiring" });
  const yandexValue = useWatch({ control, name: "yandex" });
  const totalSumValue = useWatch({ control, name: "totalSum" });

  useEffect(() => {
    const totalSum =
      Number(ipCashValue || "0") +
      Number(ipAcquiringValue || "0") +
      Number(oooCashValue || "0") +
      Number(oooAcquiringValue || "0") +
      Number(yandexValue || "0");
    setValue("totalSum", String(totalSum.toFixed(2)));
  }, [
    ipCashValue,
    ipAcquiringValue,
    oooCashValue,
    oooAcquiringValue,
    yandexValue,
  ]);

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent}>
        <Text category="h5">Выручка по подразделениям</Text>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 8,
          }}
        >
          <View style={{ width: "50%", paddingRight: 8 }}>
            <Text
              style={{ fontWeight: "bold" }}
            >{`Администратор: ${user.name}`}</Text>
          </View>
          <View style={{ width: "50%", paddingLeft: 8 }}>
            <FormDatePicker
              name="date"
              label="Дата"
              control={control}
              error={errors.date}
            />
          </View>
        </Layout>
        <Layout
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <Layout style={{ width: "50%", paddingRight: 8 }}>
            <Text style={{ fontWeight: "bold" }}>ИП Багдасарян Р.С</Text>
            <FormTextInput
              name="ipCash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              error={errors.ipCash}
              required
            />

            <FormTextInput
              name="ipAcquiring"
              label="Эквайринг"
              control={control}
              error={errors.ipAcquiring}
              pattern={/^\d*(\.\d{0,2})?$/}
              type="decimal-pad"
              required
            />
          </Layout>
          <Layout style={{ width: "50%", paddingLeft: 8 }}>
            <Text style={{ fontWeight: "bold" }}>ООО ХашЛаваш</Text>
            <FormTextInput
              name="oooCash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              error={errors.oooCash}
              required
            />

            <FormTextInput
              name="oooAcquiring"
              label="Эквайринг"
              control={control}
              error={errors.oooAcquiring}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              required
            />
          </Layout>
        </Layout>

        <Layout style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: "bold" }}>Яндекс.Еда и Деливери</Text>
          <FormTextInput
            name="yandex"
            label="Выручка"
            control={control}
            type="decimal-pad"
            error={errors.yandex}
            pattern={/^\d*(\.\d{0,2})?$/}
          />
        </Layout>

        <Layout style={{ marginTop: 16 }}>
          <Text category="label" style={{ opacity: 0.7, marginBottom: 4 }}>
            Общая выручка
          </Text>
          <Text category="h5" style={{ fontWeight: "bold" }}>
            {formatAmountString(totalSumValue)}
          </Text>
        </Layout>
      </Layout>

      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button
          onPress={handleSubmit(onSubmit)}
          style={{ width: "100%" } as StyleProp<ViewStyle>}
        >
          Далее
        </Button>
      </Layout>
    </Layout>
  );
}
