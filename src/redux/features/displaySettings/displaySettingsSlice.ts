import { createAsyncThunk, createSlice, SerializedError } from '@reduxjs/toolkit';
import { LoadingStatus } from '../../../Helper/LoadingStatus';
import * as SecureStore from 'expo-secure-store';
import { getLocalizationAsync } from 'expo-localization';
import { RootState } from '../../store';
import { ThemeType } from './ThemeType';

export interface NumberFormatSettings {
    decimalSeparator: string,
    digitGroupingSeparator: string,
}

interface DisplaySettings {
    numberFormat: NumberFormatSettings,
    themeType: ThemeType,
}

interface SavedDisplaySettings {
    numberFormat?: NumberFormatSettings,
    themeType?: ThemeType,
}

interface DisplaySettingsState {
    fetchStatus: {
        status: LoadingStatus
        error: SerializedError | null
    },
    saveStatus: {
        status: LoadingStatus
        error: SerializedError | null
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
        themeType: ThemeType.SYSTEM_DEFAULT,
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

const saveDisplaySettings = async (displaySettings: DisplaySettings): Promise<void> => {
    const jsonValue = JSON.stringify(displaySettings);
    await SecureStore.setItemAsync(STORAGE_KEY, jsonValue, { keychainAccessible: SecureStore.WHEN_UNLOCKED });
};

const readSystemNumberFormatSettings = async (): Promise<NumberFormatSettings> => {
    const localization = await getLocalizationAsync();
    return {
        decimalSeparator: localization.decimalSeparator,
        digitGroupingSeparator: localization.digitGroupingSeparator,
    };
};

export const fetchDisplaySettings = createAsyncThunk<DisplaySettings, void, {}>('displaySettings/fetchDisplaySettings', async () => {
    const displaySettingsRead = await readDisplaySettings();

    const numberFormatSettings = displaySettingsRead.numberFormat ?? await readSystemNumberFormatSettings();
    const themeType = displaySettingsRead.themeType ?? initialState.displaySettings.themeType;

    return {
        numberFormat: numberFormatSettings,
        themeType: themeType,
    };
});

export const saveThemeTypeSetting = createAsyncThunk<
    DisplaySettings, ThemeType, { state: RootState }
>('displaySettings/saveThemeTypeSetting', async (themeType, { getState }) => {
    const displaySettings = {
        ...getState().displaySettings.displaySettings,
        themeType: themeType,
    };

    await saveDisplaySettings(displaySettings);
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
            })
            .addCase(saveThemeTypeSetting.pending, (state) => {
                state.saveStatus = {
                    status: LoadingStatus.LOADING,
                    error: null,
                };
            })
            .addCase(saveThemeTypeSetting.fulfilled, (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.SUCCESSFUL,
                    error: null,
                };
                state.displaySettings = action.payload;
            })
            .addCase(saveThemeTypeSetting.rejected, (state, action) => {
                state.saveStatus = {
                    status: LoadingStatus.ERROR,
                    error: action.error,
                };
            });
    },
});

export const selectNumberFormatSettings = (state: RootState) => state.displaySettings.displaySettings.numberFormat;
export const selectThemeTypeSetting = (state: RootState) => state.displaySettings.displaySettings.themeType;
export const selectDisplaySettingsFetchStatus = (state: RootState) => state.displaySettings.fetchStatus;
export const selectDisplaySettingsSaveStatus = (state: RootState) => state.displaySettings.saveStatus;
