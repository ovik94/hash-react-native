import React, { FC, useState } from 'react';
import { Button, Icon, IconProps, Layout } from "@ui-kitten/components";
import AddExpense, { IExpense } from "../components/add-expense/AddExpense";
import { StyleSheet } from "react-native";

interface IExpensesListScreen {
}

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
  }
});

const AddIcon = (props: IconProps) => (
  <Icon {...props} name='plus'/>
);

const ExpensesListScreen: FC<IExpensesListScreen> = () => {
  const [expenses, setExpenses] = useState<Array<IExpense> | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const onAddExpense = (data: IExpense) => {
    setShowAdd(false);

    const newExpenses = (expenses || []).concat([data]);

    setExpenses(newExpenses);
  };

  const onDelete = (id: string) => {
    const filteredExpenses = expenses?.filter(expense => expense.id !== id) || [];

    setExpenses(filteredExpenses);
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Button
          style={{ width: '100%' }}
          accessoryLeft={<AddIcon/>}
          appearance="outline"
          onPress={() => setShowAdd(true)}
        >
          Добавить
        </Button>
      </Layout>
      <AddExpense
        data={expenses}
        onDelete={onDelete}
        onAdd={onAddExpense}
        showModal={showAdd}
        setShowModal={setShowAdd}
      />
    </Layout>
  )
};

export default ExpensesListScreen;
