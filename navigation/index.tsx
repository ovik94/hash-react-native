import * as React from 'react';
import * as eva from '@eva-design/eva';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Dimensions } from 'react-native';
import { ApplicationProvider, Icon, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import Colors from '../constants/Colors';
import { CoreContextProvider } from '../core/CoreContext';
// eslint-disable-next-line import/no-named-default
import { default as theme } from '../core/custom-theme.json';
import RequestFactory from '../core/request-factory';
import RequestConfigList from '../core/RequestConfigList';
import { StoreContextProvider } from '../core/StoreContext';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import ContractorsScreen from '../screens/ContractorsScreen';
import RevenueScreen from '../screens/RevenueScreen';
import AddDailyReportScreen from '../screens/daily-report-screen/AddDailyReportScreen';
import DailyReportScreen from '../screens/daily-report-screen/DailyReportScreen';
import HeaderRight from '../screens/daily-report-screen/HeaderRight';
import ExpensesListScreen from '../screens/ExpensesListScreen';
import NotFoundScreen from '../screens/NotFoundScreen';
import { RootStore } from '../stores/RootStore';
import { RootStackParamList, RootTabParamList, RootTabScreenProps } from '../types';
import LinkingConfiguration from './LinkingConfiguration';

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#fff',
    primary: Colors.light.tint
  }
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const requestFactory = new RequestFactory({ requestConfigList: RequestConfigList });
const createRequest = requestFactory.createRequest.bind(requestFactory);
const store = new RootStore();
store.setCreateRequest(createRequest);

const { height } = Dimensions.get('window');
const modalHeight = height - 210;

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
      initialRouteName="DailyReport"
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint
      }}
    >
      <BottomTab.Screen
        name="DailyReport"
        component={DailyReportScreen}
        options={({ navigation }: RootTabScreenProps<'DailyReport'>) => ({
          title: 'Отчеты',
          tabBarIcon: props => (
            <Icon
              name="file-text"
              style={{ width: 32, height: 32 }}
              fill={props.color}
            />
          ),
          headerRight: () => <HeaderRight navigation={navigation} />
        })}
      />
      <BottomTab.Screen
        name="Contractors"
        component={ContractorsScreen}
        options={({ navigation }: RootTabScreenProps<'Contractors'>) => ({
          title: 'Поставщики',
          tabBarIcon: props => (
            <Icon
              name="people-outline"
              style={{ width: 32, height: 32 }}
              fill={props.color}
            />
          )
        })}
      />
      <BottomTab.Screen
        name="Revenue"
        component={RevenueScreen}
        options={({ navigation }: RootTabScreenProps<'Revenue'>) => ({
          title: 'Выручка',
          tabBarIcon: props => (
            <Icon
              name="pie-chart-outline"
              style={{ width: 32, height: 32 }}
              fill={props.color}
            />
          )
        })}
      />
    </BottomTab.Navigator>
  );
}

function RootNavigator() {
  return (
    <StoreContextProvider value={store}>
      <CoreContextProvider value={{ modalHeight }}>
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
          <Stack.Navigator>
            <Stack.Screen
              name="Root"
              component={BottomTabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Что-то пошло не так' }} />
            <Stack.Group screenOptions={{ presentation: 'modal' }}>
              <Stack.Screen
                name="AddDailyReport"
                component={AddDailyReportScreen}
                options={{ title: 'Добавление нового отчета' }}
              />
              <Stack.Screen
                name="ExpensesList"
                component={ExpensesListScreen}
                options={{ title: 'Расходы за текущий день' }}
              />
              <Stack.Screen
                name="AddExpense"
                component={AddExpenseScreen}
                options={{ title: 'Добавление расхода' }}
              />
            </Stack.Group>
          </Stack.Navigator>
        </ApplicationProvider>
      </CoreContextProvider>
    </StoreContextProvider>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration} theme={MyTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}
