import React, { FC } from 'react';
import { StyleSheet } from 'react-native';
import { Divider, Layout, Text } from '@ui-kitten/components';
import { IDailyReport } from '../../stores/DailyReportsStore';
import { formatAmountString } from '../utils/formatAmountString';
import dateFormatter from "../utils/dateFormatter";

interface IReportDetail {
  data?: IDailyReport;
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    width: '100%',
    height: '100%',
    display: 'flex'
  },
  divider: {
    marginVertical: 16
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 8
  },
  item: {
    display: 'flex',
    marginRight: 32
  },
  label: {
    color: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 4
  }
});

const ReportDetail: FC<IReportDetail> = ({ data }) => {
  if (!data) {
    return null;
  }

  const renderItem = (label: string, value: string, bold = false) => (
    <Layout style={styles.item}>
      <Text category="label" style={styles.label}>{label}</Text>
      <Text category="p1" style={bold && { fontWeight: 'bold' }}>{value}</Text>
    </Layout>
  );

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        {renderItem('Администратор', data?.adminName)}
        {renderItem('Дата', dateFormatter(data?.date))}
        {renderItem('Общая выручка', formatAmountString(data?.totalSum), true)}
      </Layout>
      <Divider style={styles.divider} />
      <Layout>
        <Text category="label">ИП Багдасарян</Text>
        <Layout style={styles.header}>
          {renderItem('Наличные', formatAmountString(data?.ipCash))}
          {renderItem('Эквайринг', formatAmountString(data?.ipAcquiring))}
        </Layout>
      </Layout>
      <Divider style={styles.divider} />

      <Layout>
        <Text category="label">ООО ХашЛаваш</Text>
        <Layout style={styles.header}>
          {renderItem('Наличные', formatAmountString(data?.oooCash))}
          {renderItem('Эквайринг', formatAmountString(data?.oooAcquiring))}
        </Layout>
      </Layout>
      <Divider style={styles.divider} />

      <Layout>
        <Text category="label">Яндекс.Еда и Деливери</Text>
        <Layout style={styles.header}>
          {renderItem('Выручка', formatAmountString(data?.yandex))}
        </Layout>
      </Layout>
      <Divider style={styles.divider} />

      <Layout>
        {renderItem('Сдано наличных', formatAmountString(data?.totalCash), true)}
      </Layout>
      <Divider style={styles.divider} />

      <Layout>
        <Text category="label" style={{ marginBottom: 16 }}>Расходные операции</Text>
        {data?.expenses?.length && data.expenses.map(item => (
          <Layout key={item.id} style={{ width: '100%', marginBottom: 8 }}>
            <Layout style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text>{item.category.title}</Text>
              <Text>{formatAmountString(item.sum)}</Text>
            </Layout>
            <Text category="label">{item.comment}</Text>
          </Layout>
        ))}
      </Layout>
    </Layout>
  );
};

export default ReportDetail;
