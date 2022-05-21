import { createContext } from 'react';
import { IMainAppOptions } from '../types';

export type IContext = IMainAppOptions;

export const CoreContext = createContext<IContext>({} as IContext);
export const CoreContextProvider = CoreContext.Provider;
