import { useContext } from 'react';
import { StoreContext } from '../core/StoreContext';
import { RootStore } from '../stores/RootStore';

// eslint-disable-next-line import/prefer-default-export
export default function useStores(): RootStore { return useContext(StoreContext); }
