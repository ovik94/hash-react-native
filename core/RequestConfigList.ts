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
  }
};

export default RequestConfigList;
