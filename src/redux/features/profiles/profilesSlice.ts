import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { RootState } from '../../store';

export interface Profile {
    name: string,
    budgetId: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>
}

interface ProfilesState {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    objects: Profile[]
}

const initialState: ProfilesState = {
    fetchStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    saveStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    objects: [],
};

const STORAGE_KEY = 'profiles';

const readProfiles = async (): Promise<Profile[]> => {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveProfiles = async (profiles: Profile[]): Promise<void> => {
    const jsonValue = JSON.stringify(profiles);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

export const fetchProfiles = createAsyncThunk('profiles/fetchProfiles', async () => {
    return readProfiles();
});

export const overwriteProfiles = createAsyncThunk<
    Profile[], Profile[]
>('profiles/overwriteProfiles', async (profiles) => {
    await saveProfiles(profiles);
    return profiles;
});

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addCase(overwriteProfiles.pending, (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(overwriteProfiles.fulfilled, (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addCase(overwriteProfiles.rejected, (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectAllProfiles = (state: RootState) => state.profiles.objects;
export const selectProfilesFetchStatus = (state: RootState) => state.profiles.fetchStatus;
export const selectProfilesSaveStatus = (state: RootState) => state.profiles.saveStatus;
