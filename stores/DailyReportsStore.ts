import { makeAutoObservable } from 'mobx';
import { IExpense } from './ExpensesStore';
import { RootStore } from './RootStore';

export interface IDailyReport {
  id: string;
  date: string;
  adminName: string;
  ipCash: string;
  ipAcquiring: string;
  oooCash: string;
  oooAcquiring: string;
  expenses?: Array<IExpense> | null;
  totalSum: string;
}

export default class DailyReportsStore {
  public reports: Array<IDailyReport> | null = null;

  public screenMessage = '';

  public sheetMessage = '';

  public isLoadingSheet = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoadingSheet = (value: boolean) => {
    this.isLoadingSheet = value;
  };

  private setReports = (reports: Array<IDailyReport>) => {
    this.reports = reports;
  };

  private setScreenMessage = (message: string) => {
    this.screenMessage = message;
  };

  private setSheetMessage = (message: string) => {
    this.sheetMessage = message;
  };

  public fetchReports = () => this.rootStore
    .createRequest<Array<IDailyReport>>('fetchReports')
    .then(({ status, data }) => {
      if (status === 'OK' && data) {
        this.setReports(data.reverse());
      } else {
        this.setReports([]);
      }
      this.setScreenMessage('');
    })
    .catch(() => {
      this.setScreenMessage('Произошла ошибка при загрузке отчетов');
    });

  public addReport = (data: IDailyReport) => {
    this.setLoadingSheet(true);
    return this.rootStore
      .createRequest('addReport', data)
      .then(({ status }) => {
        if (status === 'OK') {
          this.setSheetMessage('');
        } else {
          this.setSheetMessage('Что-то пошло не так. Отчет не добавился');
        }
      })
      .catch(() => {
        this.setSheetMessage('Что-то пошло не так. Отчет не добавился');
      })
      .finally(() => this.setLoadingSheet(false));
  };

  public updateReport = (data: IDailyReport) => {
    this.setLoadingSheet(true);
    return this.rootStore
      .createRequest('updateReport', data)
      .then(({ status }) => {
        if (status === 'OK') {
          this.setSheetMessage('');
        } else {
          this.setSheetMessage('Что-то пошло не так. Отчет не обновился');
        }
      })
      .catch(() => {
        this.setSheetMessage('Что-то пошло не так. Отчет не обновился');
      })
      .finally(() => this.setLoadingSheet(false));
  };
}
