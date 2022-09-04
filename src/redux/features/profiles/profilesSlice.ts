import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import * as SecureStore from 'expo-secure-store';
import { RootState } from "../../store";

export interface Profile {
    name: string,
    budgetId: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>
}

interface ProfilesState {
    fetchStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    },
    saveStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    },
    objects: Profile[]
}

const initialState: ProfilesState = {
    fetchStatus: {
        status: 'idle',
        error: null
    },
    saveStatus: {
        status: 'idle',
        error: null
    },
    objects: [],
}

const storageKey = 'profiles';

const readProfiles = async (): Promise<Profile[]> => {
    const jsonValue = await SecureStore.getItemAsync(storageKey);

    if (!jsonValue) {
        return [];
    }

    return JSON.parse(jsonValue);
};

const saveProfiles = async (profiles: Profile[]): Promise<Profile[]> => {
    const jsonValue = JSON.stringify(profiles);
    await SecureStore.setItemAsync(storageKey, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
    return profiles;
};

export const fetchProfiles = createAsyncThunk('profiles/fetchProfiles', async () => {
    return readProfiles();
});

export const overwriteProfiles = createAsyncThunk<
    Profile[], Profile[]
>('categoryCombos/updateCategoryCombo', async (profiles) => {
    return saveProfiles(profiles);
});

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProfiles.pending, (state) => {
                state.fetchStatus = {
                    status: 'loading',
                    error: null
                };
            })
            .addCase(fetchProfiles.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addCase(fetchProfiles.rejected, (state, action) => {
                state.fetchStatus = {
                    status: 'error',
                    error: action.error
                }
            })
            .addCase(overwriteProfiles.pending, (state) => {
                state.saveStatus = {
                    status: 'loading',
                    error: null
                };
            })
            .addCase(overwriteProfiles.fulfilled, (state, action) => {
                state.saveStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addCase(overwriteProfiles.rejected, (state, action) => {
                state.saveStatus = {
                    status: 'error',
                    error: action.error
                }
            })
    }
});

export default profilesSlice.reducer;

export const selectAllProfiles = (state: RootState) => state.profiles.objects;
export const selectProfilesFetchStatus = (state: RootState) => state.profiles.fetchStatus;
export const selectProfilesSaveStatus = (state: RootState) => state.profiles.saveStatus;
