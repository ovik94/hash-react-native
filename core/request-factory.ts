import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { IMessage, IResponseData } from "../types";

export enum RequestMethods {
  GET = "GET",
  POST = "POST",
}

export interface IRequestConfig {
  method: keyof typeof RequestMethods;
  path: string;
  params?: any;
  headers?: { [key: string]: any };
}

export type IRequestConfigList = Record<string, IRequestConfig>;

export type GetParams = Record<
  string,
  string | number | boolean | null | undefined
>;

export type PostParams = Record<string, any>;

export interface IRequestFactoryOptions {
  requestConfigList: IRequestConfigList;
  onError?: (response?: AxiosResponse) => void;
}

export default class RequestFactory {
  private options: IRequestFactoryOptions;

  constructor(options: IRequestFactoryOptions) {
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this
  protected onSuccess = <T>(
    response: AxiosResponse<IResponseData<T>>
  ): Promise<IResponseData<T>> => {
    console.log(response, "response");
    const responseBody = response.data;

    const messages = responseBody.messages || [];
    const formMessages: IResponseData<T>["messages"] = [];
    const fieldMessages: IResponseData<T>["fieldMessages"] = {};

    messages.forEach((message: IMessage) => {
      if (message.context === "MODEL" && message.code !== "VALIDATION_FAIL") {
        formMessages.push(message);
      } else if (message.context === "FIELD" && message.path) {
        fieldMessages[message.path] = fieldMessages[message.path] || [];
        fieldMessages[message.path].push(message);
      }
    });
    responseBody.messages = formMessages;
    responseBody.fieldMessages = fieldMessages;
    return Promise.resolve(responseBody);
  };

  protected onError = <T>(
    response: AxiosResponse
  ): Promise<IResponseData<T>> => {
    if (this.options.onError) {
      this.options.onError(response);
    }

    return Promise.reject(response?.statusText);
  };

  public createRequest<T = any>(
    requestId: string,
    body?: PostParams,
    params?: GetParams,
    options?: AxiosRequestConfig
  ) {
    const isFormData =
      typeof FormData === "function" &&
      (body instanceof FormData || body instanceof File);
    const {
      path,
      method,
      headers: methodHeaders,
    } = this.options.requestConfigList[requestId];
    const { headers: requestHeaders, ...otherOptions } = options || {};

    const headers: Record<string, any> = {
      ...methodHeaders,
      ...requestHeaders,
      "X-Requested-With": "XMLHttpRequest",
    };

    if (!isFormData) {
      headers.Accept = "application/json;";
    }

    const requestConfig: AxiosRequestConfig = {
      url: `http://185.20.226.121:8082${path}`,
      method,
      headers,
      data: body,
      params,
      ...otherOptions,
    };

    return axios
      .request<T, AxiosResponse<IResponseData<T>>>(requestConfig)
      .then((response) => this.onSuccess<T>(response))
      .catch((err) => {
        console.log(err, "err");
        return this.onError<T>(err.response);
      });
  }
}
