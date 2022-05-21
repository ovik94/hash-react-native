// @ts-ignore
// @ts-ignore

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import RequestFactory from "./core/request-factory";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  AddDailyReport: undefined;
  ExpensesList: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  DailyReport: undefined;
  addDailyReport: undefined;
  TabTwo: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;

export interface IMainAppOptions {
  createRequest: RequestFactory['createRequest'];
  modalHeight: number
  locale?: Record<string, any>
}

export interface IMessage {
  type: 'ERROR' | 'WARNING' | 'INFO' | 'SUCCESS';
  context: 'GLOBAL' | 'MODEL' | 'FIELD';
  path?: string;
  value?: string;
  code?: string;
}

export interface IResponseData<T> {
  status: string;
  data?: T,
  messages?: Array<IMessage>;
  fieldMessages?: Record<string, Array<IMessage>>;
}