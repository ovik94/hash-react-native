import React, { useState } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { Button, Icon, Layout, Text } from '@ui-kitten/components';
import AddExpense, { IExpense } from '../../components/add-expense/AddExpense';
import Colors from '../../constants/Colors';
import Styles from '../../constants/Styles';
import { IStepProps } from './AddDailyReportScreen';

const styles = StyleSheet.create({
  addIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.light.tint,
    marginHorizontal: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  }
});

export default function ExpensesStep({ onComplete, onPrevious, data }: IStepProps) {
  const [expenses, setExpenses] = useState<Array<IExpense> | null>(data.expenses || null);
  const [showAdd, setShowAdd] = useState(false);

  const onSubmit = () => {
    const resultData = { ...data, expenses };

    onComplete(resultData);
  };

  const onAddExpense = (newData: IExpense) => {
    setShowAdd(false);

    const newExpenses = (expenses || []).concat([newData]);

    setExpenses(newExpenses);
  };

  const onDelete = (id: string) => {
    const filteredExpenses = expenses?.filter(expense => expense.id !== id) || [];

    setExpenses(filteredExpenses);
  };

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent as StyleProp<ViewStyle>}>
        <Layout style={styles.header}>
          <Text category="h5">Добавить расход</Text>
          <Icon name="plus" style={styles.addIcon} onPress={() => setShowAdd(true)} />
        </Layout>
        <AddExpense
          data={expenses}
          onDelete={onDelete}
          onAdd={onAddExpense}
          showModal={showAdd}
          setShowModal={setShowAdd}
        />
      </Layout>
      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button onPress={onPrevious} appearance="outline" style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Назад
        </Button>
        <Button onPress={onSubmit} style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Сохранить
        </Button>
      </Layout>
    </Layout>
  );
}
