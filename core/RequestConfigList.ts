import { IRequestConfigList, RequestMethods } from './request-factory';

const RequestConfigList: IRequestConfigList = {
  fetchReports: {
    method: RequestMethods.GET,
    path: '/api/app/dailyReport/reports'
  },
  addReport: {
    method: RequestMethods.POST,
    path: '/api/app/dailyReport/add'
  },
  updateReport: {
    method: RequestMethods.POST,
    path: '/api/app/dailyReport/update'
  },
  fetchExpenses: {
    method: RequestMethods.GET,
    path: '/api/app/expenses'
  },
  addExpense: {
    method: RequestMethods.POST,
    path: '/api/app/expenses/add'
  },
  deleteExpense: {
    method: RequestMethods.POST,
    path: '/api/app/expenses/delete'
  },
  fetchCounterparties: {
    method: RequestMethods.GET,
    path: '/api/counterparties'
  },
  fetchContractors: {
    method: RequestMethods.GET,
    path: '/api/contractors'
  }
};

export default RequestConfigList;
