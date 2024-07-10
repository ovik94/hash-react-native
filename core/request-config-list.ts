import { IRequestConfigList, RequestMethods } from "./request-factory";

const RequestConfigList: IRequestConfigList = {
  fetchUsers: {
    method: RequestMethods.GET,
    path: "/api/user/list",
  },
  login: {
    method: RequestMethods.POST,
    path: "/api/user/login",
  },
  fetchReports: {
    method: RequestMethods.GET,
    path: "/api/app/dailyReport/reports",
  },
  addReport: {
    method: RequestMethods.POST,
    path: "/api/app/dailyReport/add",
  },
  updateReport: {
    method: RequestMethods.POST,
    path: "/api/app/dailyReport/update",
  },
  fetchExpenses: {
    method: RequestMethods.GET,
    path: "/api/app/expenses",
  },
  addExpense: {
    method: RequestMethods.POST,
    path: "/api/app/expenses/add",
  },
  deleteExpense: {
    method: RequestMethods.POST,
    path: "/api/app/expenses/delete",
  },
  fetchCounterparties: {
    method: RequestMethods.GET,
    path: "/api/v2/counterparties",
  },
};

export default RequestConfigList;
