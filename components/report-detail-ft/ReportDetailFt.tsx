import React, { FC } from "react";
import { StyleSheet } from "react-native";
import { Divider, Layout, Text } from "@ui-kitten/components";
import formatAmountString from "../utils/formatAmountString";
import { IDailyReportFT } from "stores/DailyReportsFTStore";

interface IReportDetailFt {
  data?: IDailyReportFT;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: "100%",
    height: "100%",
    display: "flex",
  },
  divider: {
    marginVertical: 16,
  },
  header: {
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
  },
  item: {
    display: "flex",
    marginRight: 32,
  },
  label: {
    color: "rgba(0, 0, 0, 0.4)",
    marginBottom: 4,
  },
});

const ReportDetailFt: FC<IReportDetailFt> = ({ data }) => {
  if (!data) {
    return null;
  }

  const renderItem = (label: string, value: string, bold = false) => (
    <Layout style={styles.item}>
      <Text category="label" style={styles.label}>
        {label}
      </Text>
      <Text category="p1" style={bold && { fontWeight: "bold" }}>
        {value}
      </Text>
    </Layout>
  );

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        {renderItem("Администратор", data?.adminName || "")}
        {renderItem("Дата", data?.date)}
        {renderItem("Общая выручка", formatAmountString(data?.totalSum), true)}
      </Layout>
      <Divider style={styles.divider} />
      <Layout>
        <Layout style={styles.header}>
          {renderItem("Наличные", formatAmountString(data?.cash))}
          {renderItem("Эквайринг", formatAmountString(data?.acquiring))}
        </Layout>
      </Layout>
      {data?.comment && (
        <Layout>
          <Layout style={styles.header}>
            {renderItem("Комментарий", data?.comment)}
          </Layout>
        </Layout>
      )}
    </Layout>
  );
};

export default ReportDetailFt;
