import { IRequestConfigList, RequestMethods } from './request-factory';

const RequestConfigList: IRequestConfigList = {
  fetchReports: {
    method: RequestMethods.GET,
    path: '/api/v2/app/dailyReport/reports'
  },
  addReport: {
    method: RequestMethods.POST,
    path: '/api/v2/app/dailyReport/add'
  },
  updateReport: {
    method: RequestMethods.POST,
    path: '/api/v2/app/dailyReport/update'
  },
  fetchExpenses: {
    method: RequestMethods.GET,
    path: '/api/v2/app/expenses'
  },
  addExpense: {
    method: RequestMethods.POST,
    path: '/api/v2/app/expenses/add'
  },
  deleteExpense: {
    method: RequestMethods.POST,
    path: '/api/v2/app/expenses/delete'
  },
  fetchCounterparties: {
    method: RequestMethods.GET,
    path: '/api/v2/counterparties'
  },
  fetchUsers: {
    method: RequestMethods.GET,
    path: '/api/user/list'
  }
};

export default RequestConfigList;
