import { makeAutoObservable } from 'mobx';
import { ICategory } from './ExpensesStore';
import { RootStore } from './RootStore';

export interface ICounterparty {
  id: string;
  name: string;
  role: string;
}

export interface ICounterparties {
  kitchen?: Array<ICounterparty>;
  service?: Array<ICounterparty>;
  manager?: Array<ICounterparty>;
  provider?: Array<ICounterparty>;
}

export type IRole = 'kitchen' | 'service' | 'manager' | 'provider';

export const Categories: Array<ICategory> = [
  { id: 'kitchen', title: 'Закуп сырья кухня', icon: 'shopping-cart' },
  { id: 'beer', title: 'Закуп пиво', icon: 'shopping-cart' },
  { id: 'salary', title: 'ФОТ', icon: 'heart' },
  { id: 'courier', title: 'Курьер', icon: 'car' },
  { id: 'taxi', title: 'Такси', icon: 'car' },
  { id: 'marketing', title: 'Маркетинг, промо-материалы', icon: 'globe' },
  { id: 'household', title: 'Хоз. нужда', icon: 'cube' },
  { id: 'other', title: 'Прочие расходы', icon: 'more-horizontal' }
];

export default class CounterpartiesStore {
  public counterparties: ICounterparties | null = null;

  public roleCounterparties: Array<ICounterparty> = [];

  public isLoading = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  private setCounterparties = (counterparties: ICounterparties) => {
    this.counterparties = counterparties;
  };

  private setRoleCounterparties = (counterparties: Array<ICounterparty>) => {
    this.roleCounterparties = counterparties;
  };

  public fetchRoleCounterparties = (role: IRole) => {
    this.setLoading(true);
    return this.rootStore
      .createRequest<Array<ICounterparty>>('fetchCounterparties', {}, { role })
      .then(({ status, data }) => {
        if (status === 'OK' && data) {
          this.setRoleCounterparties(data);
        }
      })
      .finally(() => this.setLoading(false));
  };
}
