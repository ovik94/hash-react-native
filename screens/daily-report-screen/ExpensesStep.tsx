import React, { useState } from 'react';
import { StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Styles from "../../constants/Styles";
import { IStepProps } from "./AddDailyReportScreen";
import { Button, Layout } from "@ui-kitten/components";
import { IExpense } from "../../components/add-expense/AddExpense";

export default function ExpensesStep({ onComplete, onPrevious, data }: IStepProps) {
  const [expenses, setExpenses] = useState<Array<IExpense> | null>(data.expenses || null);

  const onSubmit = () => {
    const resultData = { ...data, expenses };

    onComplete(resultData);
  };

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>

      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button onPress={onPrevious} appearance='outline' style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Назад
        </Button>
        <Button onPress={onSubmit} style={{ width: '45%' } as StyleProp<ViewStyle>}>
          Сохранить
        </Button>
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({

});
