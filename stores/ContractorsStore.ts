import { makeAutoObservable } from 'mobx';
import { RootStore } from './RootStore';

export interface IContractors {
  id: string;
  title: string;
  phone: string;
  manager?: string;
  description?: string;
}

export default class ContractorsStore {
  public contractors: Array<IContractors> | null = null;

  public isLoading = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  private setContractors = (contractors: Array<IContractors>) => {
    this.contractors = contractors;
  };

  public fetchContractors = () => {
    this.setLoading(true);
    return this.rootStore
      .createRequest<Array<IContractors>>('fetchContractors')
      .then(({ status, data }) => {
        if (status === 'OK' && data) {
          this.setContractors(data);
        }
      })
      .finally(() => this.setLoading(false));
  };
}
