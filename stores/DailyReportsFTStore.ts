import { makeAutoObservable } from "mobx";
import { IExpense } from "./ExpensesStore";
import { RootStore } from "./RootStore";
import { Alert } from "react-native";

export interface IDailyReportFT {
  id?: string;
  adminName?: string;
  date: string;
  cash: string;
  acquiring: string;
  yandex: string;
  totalSum: string;
  comment: string;
}

export default class DailyReportsStore {
  public reports: Array<Required<IDailyReportFT>> | null = null;

  public screenMessage = "";

  public sheetMessage = "";

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setReports = (reports: Array<Required<IDailyReportFT>>) => {
    this.reports = reports;
  };

  private setSheetMessage = (message: string) => {
    this.sheetMessage = message;
  };

  public fetchReports = (params?: {
    from?: string;
    to?: string;
  }): Promise<Array<IDailyReportFT>> =>
    this.rootStore
      .createRequest<Array<Required<IDailyReportFT>>>(
        "fetchReportsFt",
        undefined,
        params
      )
      .then(({ status, data }) => {
        if (status === "OK" && data) {
          this.setReports(data.reverse());
          return data.reverse();
        }
        return [];
      })
      .catch((e) => {
        Alert.alert("Ошибка при запросе отчетов", e, [{ text: "OK" }]);

        return [];
      });

  public addReport = async (reportData: IDailyReportFT) =>
    this.rootStore
      .createRequest("addReportFt", reportData)
      .then(({ status, data }) => {
        if (status === "OK") {
          this.setReports([data].concat(this.reports || []));
          Alert.alert("Отчет успешно добавлен", "", [{ text: "OK" }]);
        } else {
          Alert.alert("Ошибка при добавлении отчета", "", [{ text: "OK" }]);
        }
      })
      .catch((e) => {
        Alert.alert("Ошибка при добавлении отчета", e, [{ text: "OK" }]);
      });

  public updateReport = async (updateData: IDailyReportFT) =>
    this.rootStore
      .createRequest("updateReportFt", updateData)
      .then(({ status, data }) => {
        if (status === "OK") {
          const newReports = (this.reports || []).map((report) =>
            report.id === data.id ? { ...report, ...data } : report
          );
          this.setReports(newReports);
          Alert.alert("Отчет успешно обновлен", "", [{ text: "OK" }]);
        } else {
          Alert.alert("Ошибка при обновлении отчета", "", [{ text: "OK" }]);
        }
      })
      .catch(() => {
        Alert.alert("Ошибка при обновлении отчета", "", [{ text: "OK" }]);
      });
}
