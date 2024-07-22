import React, { createRef, useCallback, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet } from "react-native";
import ActionSheet from "react-native-actions-sheet";
import { startOfMonth, lastDayOfMonth } from "date-fns";
import { Icon, Layout, Spinner, Text } from "@ui-kitten/components";
import { SwipeListItem, SwipeList, ReloadButton } from "../../components";

import formatAmountString from "../../components/utils/formatAmountString";
import useStores from "../../hooks/useStores";
import { IDailyReport } from "../../stores/DailyReportsStore";
import dateFormatter from "../../components/utils/dateFormatter";
import { IDailyReportFT } from "../../stores/DailyReportsFTStore";
import ReportDetailFt from "../../components/report-detail-ft/ReportDetailFt";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeListIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginHorizontal: 8,
  },
  sheet: {
    padding: 16,
    height: 300,
  },
});

const DailyReportFTScreen = ({ navigation }: any) => {
  const {
    dailyReportFTStore: { fetchReports, reports },
  } = useStores();
  const [loading, setLoading] = useState(false);
  const [showReportData, setShowReportData] = useState<IDailyReportFT>();
  const [refreshing, setRefreshing] = useState(false);

  const actionSheetRef = createRef<ActionSheet>();

  const [reportsParams, setReportsParams] = useState<{
    from?: string;
    to?: string;
  }>();

  useEffect(() => {
    const from = dateFormatter(startOfMonth(new Date()));
    const to = dateFormatter(lastDayOfMonth(new Date()));

    setReportsParams({ from, to });
  }, []);

  useEffect(() => {
    if (reportsParams) {
      setLoading(true);
      fetchReports(reportsParams).then((res) => {
        setLoading(false);
      });
    }
  }, [reportsParams]);

  const renderItem = ({ item }: { item: IDailyReport }) => (
    <SwipeListItem
      iconName="file-text"
      title={item.adminName}
      subtitle={item.date}
      primaryText={formatAmountString(item.totalSum)}
    />
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchReports(reportsParams).then((res) => {
      setRefreshing(false);
    });
  };

  const onReload = useCallback(() => {
    setLoading(true);
    fetchReports(reportsParams).then((res) => {
      setLoading(false);
    });
  }, [reportsParams]);

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="eye" />;
  const leftActionComponent = <Icon style={styles.swipeListIcon} name="edit" />;

  const onRightAction = (id: string) => {
    actionSheetRef.current?.setModalVisible(true);
    const report = reports?.find((item) => item.id === id);

    setShowReportData(report);
  };

  const onLeftAction = (id: string) => {
    navigation.navigate("AddDailyReportFT", {
      report: reports?.find((item) => item.id === id),
      actionType: "update",
    });
  };

  return (
    <Layout style={styles.container}>
      {loading && (
        <Layout style={styles.loading}>
          <Spinner />
        </Layout>
      )}
      {!loading && (
        <>
          <SwipeList
            data={reports}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item: IDailyReport) => item.id}
            leftActionComponent={leftActionComponent}
            rightActionComponent={rightActionComponent}
            onRightAction={onRightAction}
            onLeftAction={onLeftAction}
          />
          {reports?.length === 0 && (
            <Layout>
              <Text status="info">Отчетов пока нет</Text>
              <ReloadButton onReload={onReload} />
            </Layout>
          )}
        </>
      )}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheet}
        animated
        gestureEnabled
        defaultOverlayOpacity={0.6}
      >
        <ReportDetailFt data={showReportData} />
      </ActionSheet>
    </Layout>
  );
};

export default observer(DailyReportFTScreen);
