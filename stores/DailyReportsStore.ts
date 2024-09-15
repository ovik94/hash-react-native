import { makeAutoObservable } from "mobx";
import { IExpense } from "./ExpensesStore";
import { RootStore } from "./RootStore";
import { isThisMonth } from "date-fns";

export interface IDailyReport {
  id: string;
  date: string;
  adminName: string;
  ipCash: string;
  ipAcquiring: string;
  ipNetmonet: string;
  ipOnline: string;
  oooCash: string;
  oooAcquiring: string;
  oooNetmonet: string;
  yandex: string;
  expenses?: Array<IExpense> | null;
  totalSum: string;
  totalCash: string;
}

export default class DailyReportsStore {
  public reports: Array<IDailyReport> | null = null;

  public screenMessage = "";

  public sheetMessage = "";

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

  public fetchReports = (params?: {
    from?: string;
    to?: string;
  }): Promise<Array<IDailyReport>> =>
    this.rootStore
      .createRequest<Array<IDailyReport>>("fetchReports", undefined, params)
      .then(({ status, data }) => {
        let result: Array<IDailyReport> = [];
        if (status === "OK" && data) {
          result = data.reverse();
        }
        if (!params) {
          this.setReports(result);
        }
        this.setScreenMessage("");
        return result;
      })
      .catch(() => {
        this.setScreenMessage("Произошла ошибка при загрузке отчетов");
        return [];
      });

  public addReport = async (reportData: IDailyReport) => {
    this.setLoadingSheet(true);
    return this.rootStore
      .createRequest("addReport", reportData)
      .then(({ status, data }) => {
        if (status === "OK") {
          this.setReports([data].concat(this.reports || []));
          this.setSheetMessage("");
        } else {
          this.setSheetMessage("Что-то пошло не так. Отчет не добавился");
        }
      })
      .catch(() => {
        this.setSheetMessage("Что-то пошло не так. Отчет не добавился");
      })
      .finally(() => this.setLoadingSheet(false));
  };

  public updateReport = (updateData: IDailyReport) => {
    this.setLoadingSheet(true);
    return this.rootStore
      .createRequest("updateReport", updateData)
      .then(({ status, data }) => {
        if (status === "OK") {
          const newReports = (this.reports || []).map((report) =>
            report.id === data.id ? { ...report, ...data } : report
          );
          this.setReports(newReports);
          this.setSheetMessage("");
        } else {
          this.setSheetMessage("Что-то пошло не так. Отчет не обновился");
        }
      })
      .catch(() => {
        this.setSheetMessage("Что-то пошло не так. Отчет не обновился");
      })
      .finally(() => this.setLoadingSheet(false));
  };
}
