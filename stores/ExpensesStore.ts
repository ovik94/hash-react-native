import { makeAutoObservable } from "mobx";
import uuid from "react-native-uuid";
import { RootStore } from "./RootStore";
import { IExpenseType } from "components/expenses-list/ExpensesList";

export interface ICategory {
  counterpartyType?: string;
  title: string;
  icon: string;
}

export interface IExpense {
  id: string;
  category: ICategory;
  sum: string;
  counterparty?: string;
  comment?: string;
}

export const ExpenseCategories: Array<ICategory> = [
  { title: "Закуп сырья кухня", icon: "shopping-cart" },
  { title: "Закуп пиво", icon: "shopping-cart" },
  { counterpartyType: "service", title: "ФОТ", icon: "heart" },
  { title: "Маркетинг, промо-материалы", icon: "globe" },
  { title: "Хоз. нужда", icon: "cube" },
  { title: "Курьер", icon: "car" },
  { title: "Такси", icon: "car" },
  { title: "Премия персонала за обслуживание", icon: "percent-outline" },
  { title: "Прочие расходы", icon: "more-horizontal" },
];

export default class ExpensesStore {
  public expenses: Array<IExpense> | null = null;

  public screenMessage = "";

  public isLoading = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  public setExpenses = (expenses: Array<IExpense>) => {
    this.expenses = expenses;
  };

  private setScreenMessage = (message: string) => {
    this.screenMessage = message;
  };

  public fetchExpenses = (additionalExpenses?: Array<IExpense>) =>
    this.rootStore
      .createRequest<Array<IExpense>>("fetchExpenses")
      .then(({ status, data }) => {
        if (status === "OK" && data) {
          this.setExpenses(data.concat(additionalExpenses || []));
        } else {
          this.setExpenses([]);
        }
        this.setScreenMessage("");
      })
      .catch(() => {
        this.setScreenMessage("Произошла ошибка при загрузке расходов");
      });

  public deleteExpense = (id: string, type: IExpenseType) => {
    const newExpenses = this.expenses?.filter((item) => item.id !== id) || [];

    if (type !== "expensesList") {
      this.setExpenses(newExpenses);
      return Promise.resolve();
    }

    return this.rootStore
      .createRequest("deleteExpense", { id })
      .then(({ status }) => {
        if (status === "OK") {
          this.setScreenMessage("");
          this.setExpenses(newExpenses);
        } else {
          this.setScreenMessage("Не удалось удалить расход");
        }
      });
  };

  public addExpense = (data: any, cb: () => void, type: IExpenseType) => {
    const id = String(uuid.v4());
    const newExpenses = (this.expenses || []).concat([{ ...data, id }]);

    if (type !== "expensesList") {
      this.setExpenses(newExpenses);
      cb();
      return Promise.resolve();
    }

    return this.rootStore
      .createRequest("addExpense", { ...data, id })
      .then(({ status }) => {
        if (status === "OK") {
          this.setExpenses(newExpenses);
          cb();
        } else {
          this.setScreenMessage("Не удалось добавить расход");
        }
      })
      .catch(() => {
        this.setScreenMessage("Не удалось добавить расход");
      });
  };
}
