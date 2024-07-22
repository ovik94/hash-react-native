import * as React from "react";
import { observer } from "mobx-react-lite";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ExpensesListScreen from "../screens/ExpensesListScreen";
import NotFoundScreen from "../screens/NotFoundScreen";
import AddExpenseScreen from "../screens/AddExpenseScreen";

import AddDailyReportScreen from "../screens/daily-report-screen/AddDailyReportScreen";
import LoginScreen from "../screens/LoginScreen";

import { RootStackParamList } from "../types";
import useStores from "../hooks/useStores";
import BottomTabNavigator from "../navigation/BottomTabNavigator";
import AddDailyReportFTScreen from "../screens/daily-report-ft-screen/AddDailyReportFTScreen";

const Root = () => {
  const {
    userStore: { isAuthorized },
  } = useStores();
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator>
      {!isAuthorized ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: true, headerTitle: "Авторизация" }}
        />
      ) : (
        <>
          <Stack.Screen
            name="Root"
            component={BottomTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="NotFound"
            component={NotFoundScreen}
            options={{ title: "Что-то пошло не так" }}
          />
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen
              name="AddDailyReport"
              component={AddDailyReportScreen}
              options={{ title: "Добавление нового отчета" }}
            />
            <Stack.Screen
              name="AddDailyReportFT"
              component={AddDailyReportFTScreen}
              options={{ title: "Добавление нового отчета" }}
            />
            <Stack.Screen
              name="ExpensesList"
              component={ExpensesListScreen}
              options={{ title: "Расходы за текущий день" }}
            />
            <Stack.Screen
              name="AddExpense"
              component={AddExpenseScreen}
              options={{ title: "Добавление расхода" }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};

export default observer(Root);
