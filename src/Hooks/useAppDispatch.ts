import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';

// Use everywhere instead of plain `useDispatch`
export const useAppDispatch: () => AppDispatch = useDispatch;
