import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { getItemAsync, setItemAsync, WHEN_UNLOCKED } from 'expo-secure-store';
import { RootState } from '../../store';

type AccessTokenState = {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    accessToken: string
}

const initialState: AccessTokenState = {
    fetchStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    saveStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    accessToken: '',
};

const STORAGE_KEY = 'access-token';

export const fetchAccessToken = createAsyncThunk('accessToken/fetchAccessToken', async () => {
    const jsonValue = await getItemAsync(STORAGE_KEY);
    return jsonValue ?? '';
});

export const saveAccessToken = createAsyncThunk<string, string>('accessToken/saveAccessToken', async (accessToken: string) => {
    await setItemAsync(STORAGE_KEY, accessToken, { keychainAccessible: WHEN_UNLOCKED });
    return accessToken;
});

export const accessTokenSlice = createSlice({
    name: 'accessToken',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchAccessToken.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchAccessToken.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.accessToken = action.payload;
            })
            .addCase(fetchAccessToken.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addCase(saveAccessToken.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(saveAccessToken.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.accessToken = action.payload;
            })
            .addCase(saveAccessToken.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectAccessToken = (state: RootState) => state.accessToken.accessToken;
export const selectAccessTokenFetchStatus = (state: RootState) => state.accessToken.fetchStatus;
export const selectAccessTokenSaveStatus = (state: RootState) => state.accessToken.saveStatus;
