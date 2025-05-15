import { configureStore } from '@reduxjs/toolkit';
import { accessTokenSlice } from './features/accessToken/accessTokenSlice';
import { categoryCombosSlice } from './features/categoryCombos/categoryCombosSlice';
import { displaySettingsSlice } from './features/displaySettings/displaySettingsSlice';
import { profilesSlice } from './features/profiles/profilesSlice';
import { ynabSlice } from './features/ynab/ynabSlice';

export const Store = configureStore({
    reducer: {
        categoryCombos: categoryCombosSlice.reducer,
        profiles: profilesSlice.reducer,
        ynab: ynabSlice.reducer,
        accessToken: accessTokenSlice.reducer,
        displaySettings: displaySettingsSlice.reducer,
    },
});

export type AppDispatch = typeof Store.dispatch;
