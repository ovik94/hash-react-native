import { createContext } from 'react';
import { IMainAppOptions } from '../types';

export interface IContext extends IMainAppOptions {}

export const CoreContext = createContext<IContext>({} as IContext);
export const CoreContextProvider = CoreContext.Provider;
