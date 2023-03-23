import React, { createRef, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Button, Icon, IconProps, Layout, Spinner, Text } from '@ui-kitten/components';
import ReportDetail from '../../components/report-detail/ReportDetail';
import SwipeListItem from '../../components/swipe-list-item/SwipeListItem';
import SwipeList from '../../components/swipe-list/SwipeList';
import { formatAmountString } from '../../components/utils/formatAmountString';
import useStores from '../../hooks/useStores';
import { IDailyReport } from '../../stores/DailyReportsStore';
import { isThisMonth, startOfMonth, lastDayOfMonth, addDays } from "date-fns";
import dateFormatter from "../../components/utils/dateFormatter";

const ReloadIcon = (props: IconProps) => (
  <Icon {...props} name="sync"/>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  swipeListIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginHorizontal: 8
  },
  reloadButton: {
    marginTop: 32
  },
  sheet: {
    padding: 16
  }
});

const DailyReportScreen = ({ navigation }: any) => {
  const { dailyReportStore: { fetchReports, reports, screenMessage } } = useStores();
  const [loading, setLoading] = useState(false);
  const [showReportData, setShowReportData] = useState<IDailyReport>();
  const [refreshing, setRefreshing] = useState(false);
  const [reportsData, setReportsData] = useState<Array<IDailyReport>>([]);
  const actionSheetRef = createRef<ActionSheet>();
  const [reportsParams, setReportsParams] = useState<{ from?: string, to?: string }>();

  useEffect(() => {
    const from = dateFormatter(startOfMonth(new Date()));
    const to = dateFormatter(lastDayOfMonth(new Date()));

    setReportsParams({ from, to });
  }, []);

  useEffect(() => {
    if (reportsParams) {
      setLoading(true);
      fetchReports(reportsParams).then((res) => {
        setReportsData(res);
        setLoading(false)
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
      setReportsData(res);
      setRefreshing(false)
    });
  };

  const onReload = () => {
    setLoading(true);
    fetchReports(reportsParams).then((res) => {
      setReportsData(res);
      setLoading(false)
    });
  };

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="eye"/>;
  const leftActionComponent = <Icon style={styles.swipeListIcon} name="edit"/>;

  const onRightAction = (id: string) => {
    actionSheetRef.current?.setModalVisible(true);
    const report = reportsData?.find(item => item.id === id);

    setShowReportData(report);
  };

  const onLeftAction = (id: string) => {
    navigation.navigate('AddDailyReport', {
      report: reportsData?.find(item => item.id === id),
      type: 'update'
    });
  };

  const renderReloadButton = useMemo(() => (
    <Layout>
      <Button
        onPress={onReload}
        style={styles.reloadButton}
        appearance="outline"
        status="info"
        accessoryLeft={ReloadIcon}
      >
        Обновить
      </Button>
    </Layout>
  ), []);

  return (
    <Layout style={styles.container}>
      {loading && <Layout style={styles.loading}><Spinner/></Layout>}
      {!loading && (
        <>
          <SwipeList
            data={reportsData}
            renderItem={renderItem}
            refreshing={refreshing}
            onRefresh={onRefresh}
            keyExtractor={(item: IDailyReport) => item.id}
            leftActionComponent={leftActionComponent}
            rightActionComponent={rightActionComponent}
            onRightAction={onRightAction}
            onLeftAction={onLeftAction}
          />
          {reportsData?.length === 0 && (
            <Layout>
              <Text status="info">Отчетов пока нет</Text>
              {renderReloadButton}
            </Layout>
          )}
          {!!screenMessage && (
            <Layout>
              <Text status="danger">{screenMessage}</Text>
              {renderReloadButton}
            </Layout>
          )}
        </>
      )}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheet}
        animated
        gestureEnabled
      >
        <ReportDetail data={showReportData}/>
      </ActionSheet>
    </Layout>
  );
};

export default observer(DailyReportScreen);
