import React, { createRef, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet from 'react-native-actions-sheet';
import { Button, Icon, IconProps, Layout, Spinner, Text } from '@ui-kitten/components';
import { IExpense } from '../../components/expenses-list/ExpensesList';
import ReportDetail from '../../components/report-detail/ReportDetail';
import SwipeListItem from '../../components/swipe-list-item/SwipeListItem';
import SwipeList from '../../components/swipe-list/SwipeList';
import { formatAmountString } from '../../components/utils/formatAmountString';
import { CoreContext } from '../../core/CoreContext';

export interface IDailyReport {
  id: string;
  date: string;
  adminName: string;
  ipCash: string;
  ipAcquiring: string;
  oooCash: string;
  oooAcquiring: string;
  expenses?: Array<IExpense> | null;
  totalSum: string;
}

const ReloadIcon = (props: IconProps) => (
  <Icon {...props} name="sync" />
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

export default function DailyReportScreen({ navigation }: any) {
  const { createRequest } = useContext(CoreContext);
  const [reports, setReports] = useState<Array<IDailyReport> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showReportData, setShowReportData] = useState<IDailyReport>();
  const [refreshing, setRefreshing] = useState(false);

  const actionSheetRef = createRef<ActionSheet>();

  const fetchReports = () => createRequest<Array<IDailyReport>>('fetchReports')
    .then(({ data, status }) => {
      if (status === 'OK' && data) {
        setReports(data.reverse());
      } else {
        setReports([]);
      }
    })
    .catch((err) => {
      setMessage('Произошла ошибка');
      setReports([]);
    });

  useEffect(() => {
    if (!reports) {
      setLoading(true);
      fetchReports().finally(() => setLoading(false));
    }
  }, [reports]);

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
    fetchReports().then(() => setRefreshing(false));
  };

  const onReload = () => {
    setLoading(true);
    fetchReports().then(() => setLoading(false));
  };

  const rightActionComponent = <Icon style={styles.swipeListIcon} name="eye" />;
  const leftActionComponent = <Icon style={styles.swipeListIcon} name="edit" />;

  const onRightAction = (id: string) => {
    actionSheetRef.current?.setModalVisible(true);
    const report = reports?.find(item => item.id === id);

    setShowReportData(report);
  };

  const onLeftAction = (id: string) => {
    navigation.navigate('AddDailyReport', {
      report: reports?.find(item => item.id === id),
      type: 'update'
    });
  };

  return (
    <Layout style={styles.container}>
      {loading && <Layout style={styles.loading}><Spinner /></Layout>}
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
          )}
          {message && <Text status="danger">{message}</Text>}
        </>
      )}
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={styles.sheet}
        animated
        gestureEnabled
      >
        <ReportDetail data={showReportData} />
      </ActionSheet>
    </Layout>
  );
}
