import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import RequestFactory from "./core/request-factory";
import { RootStore } from "./stores/RootStore";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    // @ts-ignore
    type RootParamList = RootStackParamList;
  }
}

export type RootStackParamList = {
  Login: undefined;
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  AddDailyReport: undefined;
  ExpensesList: undefined;
  AddExpense: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;

export type RootTabParamList = {
  DailyReport: undefined;
  AddDailyReport: undefined;
  Contractors: undefined;
  Revenue: undefined;
  DailyReportFT: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<RootTabParamList, Screen>,
    NativeStackScreenProps<RootStackParamList>
  >;

export interface IMainAppOptions {
  createRequest: RequestFactory["createRequest"];
  locale: Record<string, any>;
  store: RootStore;
}

export interface IContextOptions {
  modalHeight: number;
}

export interface IMessage {
  type: "ERROR" | "WARNING" | "INFO" | "SUCCESS";
  context: "GLOBAL" | "MODEL" | "FIELD";
  path?: string;
  value?: string;
  code?: string;
}

export interface IResponseData<T> {
  status: string;
  data?: T;
  messages?: Array<IMessage>;
  fieldMessages?: Record<string, Array<IMessage>>;
}
export interface ISelectItem<V> {
  value: V;
  name: string;
}
