import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { ViewStyle, StyleProp, View, StyleSheet } from "react-native";
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
  ipNetmonet: string;
  oooNetmonet: string;
  ipOnline: string;
};

const dateTransform = (date: string) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

const styles = StyleSheet.create({
  columnView: {
    flexGrow: 1,
    flexBasis: 1,
  },
  columnLayout: {
    flexDirection: "row",
    gap: 8,
  },
});

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
      ipNetmonet: data?.ipNetmonet || undefined,
      ipOnline: data?.ipOnline || undefined,
      oooCash: data?.oooCash || undefined,
      oooAcquiring: data?.oooAcquiring || undefined,
      oooNetmonet: data?.oooNetmonet || undefined,
      yandex: data?.yandex || undefined,
      totalSum:
        String(
          Number(data?.ipCash || "0") +
            Number(data?.ipAcquiring || "0") +
            Number(data?.ipNetmonet || "0") +
            Number(data?.ipOnline || "0") +
            Number(data?.oooCash || "0") +
            Number(data?.oooAcquiring || "0") +
            Number(data?.oooNetmonet || "0") +
            Number(data?.yandex || "0")
        ) || "0",
    },
  });

  const onSubmit = (newData: FormData) => {
    onNext();
    setData(newData);
  };

  const ipCashValue = useWatch({ control, name: "ipCash" });
  const ipAcquiringValue = useWatch({ control, name: "ipAcquiring" });
  const ipNetmonetValue = useWatch({ control, name: "ipNetmonet" });
  const ipOnlineValue = useWatch({ control, name: "ipOnline" });

  const oooCashValue = useWatch({ control, name: "oooCash" });
  const oooAcquiringValue = useWatch({ control, name: "oooAcquiring" });
  const oooNetmonetValue = useWatch({ control, name: "oooNetmonet" });

  const yandexValue = useWatch({ control, name: "yandex" });
  const totalSumValue = useWatch({ control, name: "totalSum" });

  useEffect(() => {
    const totalSum =
      Number(ipCashValue || "0") +
      Number(ipAcquiringValue || "0") +
      Number(ipNetmonetValue || "0") +
      Number(ipOnlineValue || "0") +
      Number(oooCashValue || "0") +
      Number(oooAcquiringValue || "0") +
      Number(oooNetmonetValue || "0") +
      Number(yandexValue || "0");
    setValue("totalSum", String(totalSum.toFixed(2)));
  }, [
    ipCashValue,
    ipAcquiringValue,
    oooCashValue,
    oooAcquiringValue,
    yandexValue,
    ipNetmonetValue,
    ipOnlineValue,
    oooNetmonetValue,
  ]);

  const renderRubleIcon = () => <Text>₽</Text>;

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent}>
        <Text category="h5">Выручка по подразделениям</Text>
        <Layout
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <View style={styles.columnView}>
            <Text>Администратор</Text>
            <Text status="primary" style={{ fontWeight: "bold" }}>
              {user.name}
            </Text>
          </View>
          <View style={styles.columnView}>
            <FormDatePicker
              name="date"
              label="Дата"
              control={control}
              error={errors.date}
            />
          </View>
        </Layout>

        <Text style={{ fontWeight: "bold" }}>ИП Багдасарян Р.С</Text>
        <Layout style={styles.columnLayout}>
          <View style={styles.columnView}>
            <FormTextInput
              name="ipCash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              error={errors.ipCash}
              accessoryRight={ipCashValue && renderRubleIcon}
              required
            />
          </View>
          <View style={styles.columnView}>
            <FormTextInput
              name="ipAcquiring"
              label="Эквайринг"
              control={control}
              error={errors.ipAcquiring}
              pattern={/^\d*(\.\d{0,2})?$/}
              type="decimal-pad"
              accessoryRight={ipAcquiringValue && renderRubleIcon}
              required
            />
          </View>
        </Layout>
        <Layout style={styles.columnLayout}>
          <View style={styles.columnView}>
            <FormTextInput
              name="ipNetmonet"
              label="Нетмонет"
              control={control}
              error={errors.ipNetmonet}
              pattern={/^\d*(\.\d{0,2})?$/}
              accessoryRight={ipNetmonetValue && renderRubleIcon}
              type="decimal-pad"
            />
          </View>
          <View style={styles.columnView}>
            <FormTextInput
              name="ipOnline"
              label="Онлайн оплата"
              control={control}
              error={errors.ipOnline}
              pattern={/^\d*(\.\d{0,2})?$/}
              accessoryRight={ipOnlineValue && renderRubleIcon}
              type="decimal-pad"
            />
          </View>
        </Layout>
        <Layout style={styles.columnLayout}>
          <View style={styles.columnView}>
            <FormTextInput
              name="yandex"
              label="Яндекс.Еда и Деливери"
              control={control}
              type="decimal-pad"
              error={errors.yandex}
              pattern={/^\d*(\.\d{0,2})?$/}
              accessoryRight={yandexValue && renderRubleIcon}
            />
          </View>
        </Layout>

        <Layout style={{ marginTop: 16 }}>
          <Text style={{ fontWeight: "bold" }}>ООО ХашЛаваш</Text>

          <Layout style={styles.columnLayout}>
            <View style={styles.columnView}>
              <FormTextInput
                name="oooCash"
                label="Наличные"
                control={control}
                type="decimal-pad"
                pattern={/^\d*(\.\d{0,2})?$/}
                error={errors.oooCash}
                accessoryRight={oooCashValue && renderRubleIcon}
                required
              />
            </View>

            <View style={styles.columnView}>
              <FormTextInput
                name="oooAcquiring"
                label="Эквайринг"
                control={control}
                error={errors.oooAcquiring}
                type="decimal-pad"
                pattern={/^\d*(\.\d{0,2})?$/}
                accessoryRight={oooAcquiringValue && renderRubleIcon}
                required
              />
            </View>
            <View style={styles.columnView}>
              <FormTextInput
                name="oooNetmonet"
                label="Нетмонет"
                control={control}
                error={errors.oooNetmonet}
                pattern={/^\d*(\.\d{0,2})?$/}
                accessoryRight={oooNetmonetValue && renderRubleIcon}
                type="decimal-pad"
              />
            </View>
          </Layout>
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
