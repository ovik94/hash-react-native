import { observer } from "mobx-react-lite";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@ui-kitten/components";

import ContractorsScreen from "../screens/ContractorsScreen";
import RevenueScreen from "../screens/RevenueScreen";
import DailyReportScreen from "../screens/daily-report-screen/DailyReportScreen";
import HeaderRight from "../screens/daily-report-screen/HeaderRight";
import { RootTabParamList, RootTabScreenProps } from "../types";
import Colors from "../constants/Colors";
import useStores from "../hooks/useStores";
import DailyReportFTScreen from "../screens/DailyReportFTScreen";

const BottomTabNavigator = () => {
  const {
    userStore: { user, checkPrivilege },
  } = useStores();

  const BottomTab = createBottomTabNavigator<RootTabParamList>();

  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
      }}
    >
      {checkPrivilege("APP_DAILY_REPORT", "admin") && (
        <BottomTab.Screen
          name="DailyReport"
          component={DailyReportScreen}
          options={({ navigation }: RootTabScreenProps<"DailyReport">) => ({
            title: "Отчеты",
            tabBarIcon: (props) => (
              <Icon
                name="file-text"
                style={{ width: 32, height: 32 }}
                fill={props.color}
              />
            ),
            headerRight: () => <HeaderRight navigation={navigation} />,
          })}
        />
      )}
      {checkPrivilege("APP_CONTRACTORS", "admin") && (
        <BottomTab.Screen
          name="Contractors"
          component={ContractorsScreen}
          options={() => ({
            title: "Поставщики",
            tabBarIcon: (props) => (
              <Icon
                name="people-outline"
                style={{ width: 32, height: 32 }}
                fill={props.color}
              />
            ),
          })}
        />
      )}
      {checkPrivilege("APP_REVENUE", "admin") && (
        <BottomTab.Screen
          name="Revenue"
          component={RevenueScreen}
          options={() => ({
            title: "Выручка",
            tabBarIcon: (props) => (
              <Icon
                name="pie-chart-outline"
                style={{ width: 32, height: 32 }}
                fill={props.color}
              />
            ),
          })}
        />
      )}
      {checkPrivilege("APP_DAILY_REPORT", "teller") && (
        <BottomTab.Screen
          name="DailyReportFT"
          component={DailyReportFTScreen}
          options={() => ({
            title: "Отчеты",
            tabBarIcon: (props) => (
              <Icon
                name="file-text"
                style={{ width: 32, height: 32 }}
                fill={props.color}
              />
            ),
          })}
        />
      )}
    </BottomTab.Navigator>
  );
};

export default observer(BottomTabNavigator);
