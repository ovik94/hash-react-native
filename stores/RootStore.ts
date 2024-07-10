/* eslint-disable import/no-cycle */
import { makeObservable, action, observable } from "mobx";
import RequestFactory from "../core/request-factory";
import CounterpartiesStore from "./CounterpartiesStore";
import DailyReportsStore from "./DailyReportsStore";
import ExpensesStore from "./ExpensesStore";
import UserStore from "./UserStore";

export interface IStoreParams {
  createRequest: RequestFactory["createRequest"];
}

export class RootStore {
  createRequest: RequestFactory["createRequest"] = Promise.resolve;

  isLoading = false;

  dailyReportStore: DailyReportsStore;

  expensesStore: ExpensesStore;

  counterpartiesStore: CounterpartiesStore;

  userStore: UserStore;

  constructor() {
    this.dailyReportStore = new DailyReportsStore(this);
    this.expensesStore = new ExpensesStore(this);
    this.counterpartiesStore = new CounterpartiesStore(this);
    this.userStore = new UserStore(this);

    makeObservable(this, { isLoading: observable, setLoading: action });
  }

  setCreateRequest(createRequest: RequestFactory["createRequest"]) {
    this.createRequest = createRequest;
  }

  public setLoading = (isLoading: boolean) => {
    this.isLoading = isLoading;
  };
}
