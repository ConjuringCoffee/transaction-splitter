import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { isOneOf } from '../../isOneOf';
import { RootState } from '../../store';

export type BudgetInProfile = {
    budgetId: string,
    name?: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>
}

export type Profile = {
    budgets: [BudgetInProfile, BudgetInProfile]
}

type ProfilesState = {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    profile: Profile | null
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
    profile: null,
};

const STORAGE_KEY = 'profile-v3';
const LEGACY_STORAGE_KEY = 'profiles-v2';

const SECURE_STORE_OPTIONS: SecureStore.SecureStoreOptions = { keychainAccessible: SecureStore.WHEN_UNLOCKED };

type LegacyProfile = { id: string, budgets: [BudgetInProfile, BudgetInProfile] };

const readProfile = async (): Promise<Profile | null> => {
    const json = await SecureStore.getItemAsync(STORAGE_KEY);
    if (json) {
        return JSON.parse(json) as Profile;
    }

    // migrate from profiles-v2 (array format)
    const legacyJson = await SecureStore.getItemAsync(LEGACY_STORAGE_KEY);
    if (legacyJson) {
        const legacy = JSON.parse(legacyJson) as LegacyProfile[];
        if (legacy.length > 0) {
            const { budgets } = legacy[0];
            const migratedProfile: Profile = { budgets };
            await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(migratedProfile), SECURE_STORE_OPTIONS);
            return migratedProfile;
        }
    }

    return null;
};

const writeProfile = async (profile: Profile | null): Promise<void> => {
    const json = JSON.stringify(profile);
    await SecureStore.setItemAsync(STORAGE_KEY, json, SECURE_STORE_OPTIONS);
};

export const fetchProfile = createAsyncThunk('profiles/fetchProfile', async () => {
    return readProfile();
});

export const saveProfile = createAsyncThunk<Profile, Profile>(
    'profiles/saveProfile',
    async (profile) => {
        await writeProfile(profile);
        return profile;
    },
);

export const deleteProfile = createAsyncThunk('profiles/deleteProfile', async () => {
    await writeProfile(null);
    return null;
});

export const profilesSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProfile.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.profile = action.payload;
            })
            .addCase(fetchProfile.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            })
            .addMatcher(isOneOf([saveProfile.pending, deleteProfile.pending]), (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addMatcher(isOneOf([saveProfile.fulfilled, deleteProfile.fulfilled]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.profile = action.payload;
            })
            .addMatcher(isOneOf([saveProfile.rejected, deleteProfile.rejected]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectProfile = (state: RootState) => state.profiles.profile;
export const selectProfileFetchStatus = (state: RootState) => state.profiles.fetchStatus;
export const selectProfileSaveStatus = (state: RootState) => state.profiles.saveStatus;
