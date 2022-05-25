import React, { FC, useContext, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Icon, IconProps, Layout, Spinner, Text } from '@ui-kitten/components';
import ExpensesList, { IExpense } from '../components/expenses-list/ExpensesList';
import { CoreContext } from '../core/CoreContext';

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  loading: {
    flex: 1,
    marginTop: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  }
});

const AddIcon = (props: IconProps) => (
  <Icon {...props} name="plus" />
);

const ExpensesListScreen: FC = () => {
  const { createRequest } = useContext(CoreContext);
  const [expenses, setExpenses] = useState<Array<IExpense> | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = () => createRequest<Array<IExpense>>('fetchExpenses')
    .then(({ data, status }) => {
      if (status === 'OK' && data) {
        setExpenses(data);
      }
    })
    .catch(() => {
      setMessage('Произошла ошибка');
      setExpenses([]);
    });

  useEffect(() => {
    setLoading(true);
    fetchExpenses().finally(() => setLoading(false));
  }, []);

  const onAddExpense = (data: IExpense) => {
    setShowAdd(false);
    setLoading(true);
    createRequest('addExpense', data).then(({ status }) => {
      if (status === 'OK') {
        return fetchExpenses();
      }
      setMessage('Не удалось добавить расход');
    }).finally(() => setLoading(false));
  };

  const onDelete = (id: string) => {
    setLoading(true);
    createRequest('deleteExpense', { id }).then(({ status }) => {
      if (status === 'OK') {
        return fetchExpenses();
      }
      setMessage('Не удалось удалить расход');
    }).finally(() => {
      setLoading(false);
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchExpenses().then(() => {
      setMessage(null);
      setRefreshing(false);
    });
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Button
          style={{ width: '100%' }}
          accessoryLeft={<AddIcon />}
          appearance="outline"
          onPress={() => setShowAdd(true)}
        >
          Добавить
        </Button>
      </Layout>
      {loading && <Layout style={styles.loading}><Spinner /></Layout>}
      {!loading && (
        <>
          {expenses?.length === 0 && <Text status="info">Расходов пока нет</Text>}
          <ExpensesList
            data={expenses}
            onDelete={onDelete}
            onAdd={onAddExpense}
            showModal={showAdd}
            setShowModal={setShowAdd}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
          {message && <Text status="danger">{message}</Text>}
        </>
      )}
    </Layout>
  );
};

export default ExpensesListScreen;
