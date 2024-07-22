import React, { FC, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import moment from "moment";
import { Layout, Text } from "@ui-kitten/components";
import { useForm, useWatch } from "react-hook-form";

import { FormDatePicker, FormTextInput } from "../../components";
import formatAmountString from "../../components/utils/formatAmountString";
import LoadingButton from "../../components/form-controls/LoadingButton";

const styles = StyleSheet.create({
  content: {
    flexGrow: 5,
  },
  receipts: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  commentTextStyle: {
    minHeight: 64,
  },
  totalAmount: {
    marginVertical: 16,
  },
});

const dateTransform = (date: string) => {
  const [day, month, year] = date.split(".");

  return `${month}/${day}/${year}`;
};

export type AddDailyReportFtFormData = {
  id?: string;
  date: string | Date;
  cash: string;
  acquiring: string;
  totalSum: string;
  comment: string;
};

interface IAddReportFtForm {
  onSubmit: (data: AddDailyReportFtFormData) => void;
  isUpdate: boolean;
  loading: boolean;
  report: AddDailyReportFtFormData;
}

const AddReportFtForm: FC<IAddReportFtForm> = ({
  report,
  onSubmit,
  isUpdate,
  loading,
}: any) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<AddDailyReportFtFormData>({
    defaultValues: {
      id: report?.id || undefined,
      date: report?.date
        ? new Date(moment(dateTransform(report?.date)).format())
        : new Date(),
      cash: report?.cash,
      acquiring: report?.acquiring,
      totalSum: report?.totalSum,
      comment: report?.comment,
    },
  });

  const cquiringValue = useWatch({ control, name: "acquiring" });
  const cashValue = useWatch({ control, name: "cash" });
  const totalSumValue = useWatch({ control, name: "totalSum" });

  useEffect(() => {
    const totalSum = Number(cquiringValue || "0") + Number(cashValue || "0");
    setValue("totalSum", String(totalSum.toFixed(2)));
  }, [cquiringValue, cashValue]);

  return (
    <>
      <Layout style={styles.content}>
        <FormDatePicker
          name="date"
          label="Дата"
          control={control}
          error={errors.date}
          disabled={loading}
        />
        <Layout style={styles.receipts}>
          <Layout style={{ width: "50%" }}>
            <FormTextInput
              name="cash"
              label="Наличные"
              control={control}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              error={errors.cash}
              disabled={loading}
              required
            />
          </Layout>
          <Layout style={{ width: "50%", paddingLeft: 8 }}>
            <FormTextInput
              name="acquiring"
              label="Эквайринг"
              control={control}
              type="decimal-pad"
              pattern={/^\d*(\.\d{0,2})?$/}
              error={errors.acquiring}
              disabled={loading}
              required
            />
          </Layout>
        </Layout>
        <FormTextInput
          name="comment"
          label="Комментарий"
          control={control}
          error={errors.comment}
          multiline
          disabled={loading}
          textStyle={styles.commentTextStyle}
        />
      </Layout>
      <Layout style={styles.totalAmount}>
        <Text category="label">Общая выручка</Text>
        <Text category="h5" style={{ fontWeight: "bold" }}>
          {formatAmountString(totalSumValue)}
        </Text>
      </Layout>
      <LoadingButton onPress={handleSubmit(onSubmit)} loading={loading}>
        {isUpdate ? "Обновить" : "Сохранить"}
      </LoadingButton>
    </>
  );
};

export default observer(AddReportFtForm);
