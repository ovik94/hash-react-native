import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export enum PrivilegeType {

}


export interface ICounterparty {
  id: string;
  name: string;
  type: ICounterpartyTypes;
  companyName?: string;
  phone?: string;
  description?: string;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'waiter' | 'supervisor',
  privilege: Array<PrivilegeType>
}

export type ICounterpartyTypes = 'kitchen' | 'service' | 'manager' | 'provider';

export default class CounterpartiesStore {
  public counterparties: Array<ICounterparty> | null = null;

  public users: Array<IUser> | null = null;

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

  private setUsers = (users: Array<IUser>) => {
    this.users = users;
  };

  public fetchUsers = () => {
    this.setLoading(true);
    return this.rootStore
      .createRequest<Array<IUser>>('fetchUsers')
      .then(({ status, data }) => {
        if (status === 'OK' && data) {
          this.setUsers(data);
        }
      })
      .finally(() => this.setLoading(false));
  };

  public fetchCounterparties = (type?: ICounterpartyTypes) => {
    this.setLoading(true);
    return this.rootStore
      .createRequest<Array<ICounterparty>>('fetchCounterparties', {}, { type })
      .then(({ status, data }) => {
        if (status === 'OK' && data) {
          this.setCounterparties(data);
        }
      })
      .finally(() => this.setLoading(false));
  };
}
