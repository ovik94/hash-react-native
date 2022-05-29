/* eslint-disable import/no-cycle */
import { makeObservable, action, observable } from 'mobx';
import RequestFactory from '../core/request-factory';
import CounterpartiesStore from './CounterpartiesStore';
import DailyReportsStore from './DailyReportsStore';
import ExpensesStore from './ExpensesStore';

export interface IStoreParams {
  createRequest: RequestFactory['createRequest']
}

export class RootStore {
  createRequest: RequestFactory['createRequest'] = Promise.resolve;

  isLoading = false;

  dailyReportStore: DailyReportsStore;

  expensesStore: ExpensesStore;

  counterpartiesStore: CounterpartiesStore;

  constructor() {
    this.dailyReportStore = new DailyReportsStore(this);
    this.expensesStore = new ExpensesStore(this);
    this.counterpartiesStore = new CounterpartiesStore(this);

    makeObservable(this, { isLoading: observable, setLoading: action });
  }

  setCreateRequest(createRequest: RequestFactory['createRequest']) {
    this.createRequest = createRequest;
  }

  public setLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}
