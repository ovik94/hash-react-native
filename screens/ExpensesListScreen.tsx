import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { StyleSheet } from 'react-native';
import { Icon, Layout, Text } from '@ui-kitten/components';
import ExpensesList from '../components/expenses-list/ExpensesList';
import Colors from '../constants/Colors';

const styles = StyleSheet.create({
  container: {
    padding: 16
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  addIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.light.tint,
    marginHorizontal: 8
  }
});

const ExpensesListScreen: FC<{ navigation: any; }> = ({ navigation }: any) => {
  const onOpenAddExpense = () => {
    navigation.navigate('AddExpense', { type: 'expensesList' });
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Text category="h5">Расходы за день</Text>
        <Icon name="plus" style={styles.addIcon} onPress={onOpenAddExpense} />
      </Layout>
      <ExpensesList type="expensesList" />
    </Layout>
  );
};

export default observer<{ navigation: any }>(ExpensesListScreen);
