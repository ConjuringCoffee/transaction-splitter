import { createAsyncThunk, createSlice, nanoid, SerializedError } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import { isOneOf } from '../../isOneOf';
import { RootState } from '../RootState';

export type BudgetInProfile = {
    budgetId: string,
    name?: string,
    debtorAccountId: string,
    elegibleAccountIds: Array<string>
}


export type Profile = {
    id: string,
    budgets: [BudgetInProfile, BudgetInProfile]
}

export type ProfileToCreate = Omit<Profile, 'id'>;

type ProfilesState = {
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

const STORAGE_KEY = 'profiles-v2';

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

export const addProfile = createAsyncThunk<
    Profile[], ProfileToCreate, { state: RootState }
>('profiles/addProfile', async (profile, thunkAPI) => {
    const newProfile: Profile = { ...profile, id: nanoid() };
    const newProfiles = [...thunkAPI.getState().profiles.objects, newProfile];

    await saveProfiles(newProfiles);

    return newProfiles;
});

export const updateProfile = createAsyncThunk<
    Profile[], { profile: Profile }, { state: RootState }
>('profiles/updateProfile', async ({ profile }, { getState }) => {
    const newProfiles = [...getState().profiles.objects];
    const index = newProfiles.findIndex((c) => c.id = profile.id);

    newProfiles[index] = profile;

    await saveProfiles(newProfiles);

    return newProfiles;
});

export const deleteProfile = createAsyncThunk<
    Profile[], string, { state: RootState }
>('profiles/deleteProfile', async (profileId, thunkAPI) => {
    const newProfiles = thunkAPI.getState().profiles.objects.filter((profile) => profile.id !== profileId);
    await saveProfiles(newProfiles);

    return newProfiles;
});

export const deleteAllProfiles = createAsyncThunk('profiles/deleteAllProfiles', async () => {
    const newProfiles: Profile[] = [];
    await saveProfiles(newProfiles);
    return newProfiles;
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
            .addMatcher(isOneOf([updateProfile.pending, addProfile.pending, deleteProfile.pending, deleteAllProfiles.pending]), (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addMatcher(isOneOf([updateProfile.fulfilled, addProfile.fulfilled, deleteProfile.fulfilled, deleteAllProfiles.fulfilled]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.objects = action.payload;
            })
            .addMatcher(isOneOf([updateProfile.rejected, addProfile.rejected, deleteProfile.rejected, deleteAllProfiles.rejected]), (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectProfiles = (state: RootState) => state.profiles.objects;
export const selectProfile = (state: RootState, id: string | undefined) => state.profiles.objects.find((profile) => profile.id === id);
export const selectProfilesFetchStatus = (state: RootState) => state.profiles.fetchStatus;
export const selectProfilesSaveStatus = (state: RootState) => state.profiles.saveStatus;
