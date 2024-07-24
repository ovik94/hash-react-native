import React, { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import { Layout } from "@ui-kitten/components";
import { useFocusEffect } from "@react-navigation/native";

import useStores from "../../hooks/useStores";
import dateFormatter from "../../components/utils/dateFormatter";
import AddReportFtForm, {
  AddDailyReportFtFormData,
} from "../../components/add-report-ft-form.tsx/AddReportFtForm";

const styles = StyleSheet.create({
  wrapper: {
    height: "100%",
    margin: 32,
    paddingBottom: 64,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
});

const AddDailyReportFTScreen = ({ navigation, route }: any) => {
  const {
    dailyReportFTStore: { addReport, updateReport },
    userStore: { user },
  } = useStores();

  const [loading, setLoading] = useState(false);

  const isUpdate = route?.params?.actionType === "update";

  const onSubmit = useCallback(
    (data: AddDailyReportFtFormData) => {
      setLoading(true);

      const body = {
        ...data,
        date: dateFormatter(data.date),
        adminName: user.name,
      };

      (isUpdate ? updateReport(body) : addReport(body)).then(() => {
        setLoading(false);
        navigation.navigate("DailyReportFT");
      });
    },
    [user, isUpdate]
  );

  useFocusEffect(
    useCallback(() => {
      if (isUpdate) {
        navigation.setOptions({ title: "Обновление отчета" });
      }
    }, [navigation, isUpdate])
  );

  return (
    <Layout style={styles.wrapper}>
      <AddReportFtForm
        onSubmit={onSubmit}
        isUpdate={isUpdate}
        loading={loading}
        report={route?.params?.report}
      />
    </Layout>
  );
};

export default observer(AddDailyReportFTScreen);
