import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import * as SecureStore from 'expo-secure-store';
import { getLocalizationAsync } from 'expo-localization';
import { RootState } from '../../store';

export interface NumberFormatSettings {
    decimalSeparator: string,
    digitGroupingSeparator: string,
}

interface DisplaySettings {
    numberFormat: NumberFormatSettings,
}

interface SavedDisplaySettings {
    numberFormat?: NumberFormatSettings,
}

interface DisplaySettingsState {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    displaySettings: DisplaySettings,
}

const initialState: DisplaySettingsState = {
    fetchStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    saveStatus: {
        status: LoadingStatus.IDLE,
        error: null,
    },
    displaySettings: {
        numberFormat: {
            decimalSeparator: '',
            digitGroupingSeparator: '',
        },
    },
};

const STORAGE_KEY = 'displaySettings';

const readDisplaySettings = async (): Promise<SavedDisplaySettings> => {
    const jsonValue = await SecureStore.getItemAsync(STORAGE_KEY);

    if (!jsonValue) {
        return {};
    }

    return JSON.parse(jsonValue);
};

export const fetchDisplaySettings = createAsyncThunk<DisplaySettings, void, {}>('displaySettings/fetchDisplaySettings', async () => {
    let displaySettings: DisplaySettings;
    const displaySettingsRead = await readDisplaySettings();

    if (displaySettingsRead.numberFormat !== undefined) {
        displaySettings = { numberFormat: displaySettingsRead.numberFormat };
    } else {
        const localization = await getLocalizationAsync();

        displaySettings = {
            numberFormat: {
                decimalSeparator: localization.decimalSeparator,
                digitGroupingSeparator: localization.digitGroupingSeparator,
            },
        };
    }

    return displaySettings;
});

export const displaySettingsSlice = createSlice({
    name: 'displaySettings',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchDisplaySettings.pending, (state) => {
                state.fetchStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(fetchDisplaySettings.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.displaySettings = action.payload;
            })
            .addCase(fetchDisplaySettings.rejected, (state, action) => {
                state.fetchStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectNumberFormatSettings = (state: RootState) => state.displaySettings.displaySettings.numberFormat;
export const selectDisplaySettingsFetchStatus = (state: RootState) => state.displaySettings.fetchStatus;
export const selectDisplaySettingsSaveStatus = (state: RootState) => state.displaySettings.saveStatus;
