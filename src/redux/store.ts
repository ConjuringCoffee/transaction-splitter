import { configureStore } from '@reduxjs/toolkit';
import categoryCombosSlice from './features/categoryCombos/categoryCombosSlice';

export const store = configureStore({
    reducer: {
        categoryCombos: categoryCombosSlice
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;