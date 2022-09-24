import { configureStore } from '@reduxjs/toolkit';
import { accessTokenSlice } from './features/accessToken/accessTokenSlice';
import { budgetCombosSlice } from './features/budgetCombos/budgetCombos';
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
        budgetCombos: budgetCombosSlice.reducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof Store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof Store.dispatch;
