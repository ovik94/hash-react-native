import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { StyleSheet, ViewStyle, StyleProp } from "react-native";
import { Button, Icon, Layout, Text } from "@ui-kitten/components";
import ExpensesList from "../../components/expenses-list/ExpensesList";
import Colors from "../../constants/Colors";
import Styles from "../../constants/Styles";
import useStores from "../../hooks/useStores";
import { IStepProps } from "./AddDailyReportScreen";

const styles = StyleSheet.create({
  addIcon: {
    width: 32,
    height: 32,
    tintColor: Colors.light.tint,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

const ExpensesStep = ({
  onComplete,
  onPrevious,
  data,
  type,
  navigation,
}: IStepProps) => {
  const {
    expensesStore: { fetchExpenses, expenses },
  } = useStores();

  useEffect(() => {
    if (type === "add") {
      fetchExpenses();
    }
  }, []);

  const onSubmit = () => {
    let expensesSum = 0;
    expenses?.forEach((item) => {
      expensesSum += Number(item.sum);
    });

    const totalCash = Number(data.ipCash) + Number(data.oooCash) - expensesSum;
    const resultData = { ...data, expenses, totalCash: String(totalCash) };

    onComplete(resultData);
  };

  const onOpenAddExpense = () => {
    navigation.navigate("AddExpense", { type: "report" });
  };

  return (
    <Layout style={Styles.stepForm as StyleProp<ViewStyle>}>
      <Layout style={Styles.stepContent as StyleProp<ViewStyle>}>
        <Layout style={styles.header}>
          <Text category="h5">Расходы за день</Text>
          <Icon name="plus" style={styles.addIcon} onPress={onOpenAddExpense} />
        </Layout>
        <ExpensesList
          data={data.expenses || []}
          type={type === "add" ? "reportAdd" : "reportUpdate"}
          hasRefresh={false}
        />
      </Layout>
      <Layout style={Styles.stepButtons as StyleProp<ViewStyle>}>
        <Button
          onPress={onPrevious}
          appearance="outline"
          style={{ width: "45%" } as StyleProp<ViewStyle>}
        >
          Назад
        </Button>
        <Button
          onPress={onSubmit}
          style={{ width: "45%" } as StyleProp<ViewStyle>}
        >
          Сохранить
        </Button>
      </Layout>
    </Layout>
  );
};

export default observer<IStepProps>(ExpensesStep);
