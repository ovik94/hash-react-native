import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

export interface ICounterparty {
  id: string;
  name: string;
  type: ICounterpartyTypes;
  companyName?: string;
  phone?: string;
  description?: string;
}

export type ICounterpartyTypes = "kitchen" | "service" | "manager" | "provider";

export default class CounterpartiesStore {
  public counterparties: Array<ICounterparty> | null = null;

  public isLoading = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  private setCounterparties = (counterparties: Array<ICounterparty>) => {
    this.counterparties = counterparties;
  };

  public fetchCounterparties = (type?: ICounterpartyTypes) => {
    this.setLoading(true);

    return this.rootStore
      .createRequest<Array<ICounterparty>>("fetchCounterparties", undefined, {
        type,
      })
      .then(({ status, data }) => {
        if (status === "OK" && data) {
          this.setCounterparties(data);
        }
      })
      .finally(() => this.setLoading(false));
  };
}
