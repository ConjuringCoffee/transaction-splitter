import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { RootState } from '../redux/store';

// Use everywhere instead of plain `useSelector`
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
