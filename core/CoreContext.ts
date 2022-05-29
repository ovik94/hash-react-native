import { createContext } from 'react';
import { IContextOptions } from '../types';

export type IContext = IContextOptions;

export const CoreContext = createContext<IContext>({} as IContext);
export const CoreContextProvider = CoreContext.Provider;
