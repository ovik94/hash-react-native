import { makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";
import { Alert } from "react-native";

export enum PrivilegeType {
  EDIT_USER = "EDIT_USER",
  EDIT_SUPERVISOR = "EDIT_SUPERVISOR",
  EDIT_FEEDBACK_REQUESTS = "EDIT_FEEDBACK_REQUESTS",
  EDIT_FORTUNE_DATA = "EDIT_FORTUNE_DATA",
  UPLOAD_STATEMENT = "UPLOAD_STATEMENT",
  RESERVE_BANQUET = "RESERVE_BANQUET",
  APP_DAILY_REPORT = "APP_DAILY_REPORT",
  APP_CONTRACTORS = "APP_CONTRACTORS",
  APP_REVENUE = "APP_REVENUE",
}

type Role = "admin" | "waiter" | "supervisor" | "teller";

export interface IUser {
  id: string;
  name: string;
  phone: string;
  role: Role;
  privilege: Array<PrivilegeType>;
}

export default class UserStore {
  public user: IUser = {} as IUser;

  public users: Array<IUser> | null = null;

  public isAuthorized: boolean = false;

  public isLoading: boolean = false;

  protected rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this);
  }

  private setLoading = (value: boolean) => {
    this.isLoading = value;
  };

  public setAuthorized = (value: boolean) => {
    this.isAuthorized = value;
  };

  public setUser = (user: IUser) => {
    this.user = user;
  };

  public setUsers = (usersList: Array<IUser>) => {
    this.users = usersList;
  };

  public checkPrivilege = (code: keyof typeof PrivilegeType, role?: Role) => {
    if (Boolean(this.user.privilege.find((item) => item.includes(code)))) {
      if (role && this.user.role === role) {
        return true;
      } else if (role && this.user.role !== role) {
        return false;
      }
      return true;
    }
    return false;
  };

  public fetchUsers = async (): Promise<void> => {
    this.setLoading(true);
    return this.rootStore
      .createRequest<Array<IUser>>("fetchUsers")
      .then(({ status, data }) => {
        if (status === "OK" && data) {
          this.setUsers(data);
          this.setLoading(false);
        }
      })
      .catch(() => this.setLoading(false));
  };

  public login = async (data: {
    id: string;
    password: string;
  }): Promise<void> => {
    this.setLoading(true);
    return this.rootStore
      .createRequest("login", data)
      .then(({ status }) => {
        if (status !== "OK") {
          Alert.alert("Ошибка", "Неправильный пароль", [{ text: "OK" }]);
        }
        if (status === "OK") {
          const user = this.users?.find((item) => item.id === data.id);
          if (user) {
            this.setUser(user);
            this.setAuthorized(true);
          }
        }
        this.setLoading(false);
      })
      .catch((err) => {
        Alert.alert("Ошибка", "err", [{ text: "OK" }]);

        this.setLoading(false);
      });
  };
}
