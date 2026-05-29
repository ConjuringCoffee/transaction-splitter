import { useCallback } from 'react';
import { isRejected, ThunkAction, UnknownAction } from '@reduxjs/toolkit';
import { useAppDispatch } from './useAppDispatch';

// createAsyncThunk dispatches never throw — they always resolve to either a
// fulfilled or rejected action. This wrapper converts a rejection into a
// thrown Error so call sites can use normal try/catch instead of inspecting
// the action result manually.
type Dispatchable = UnknownAction | ThunkAction<any, any, any, any>;

export const useThrowingDispatch = () => {
    const dispatch = useAppDispatch();
    return useCallback(
        async (action: Dispatchable) => {
            const result = await Promise.resolve(dispatch(action as UnknownAction));
            if (isRejected(result)) {
                throw new Error(result.error.message ?? 'Unexpected error');
            }
            return result;
        },
        [dispatch],
    );
};
