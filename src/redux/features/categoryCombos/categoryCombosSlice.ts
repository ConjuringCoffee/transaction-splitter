import { createAsyncThunk, createSlice, SerializedError } from "@reduxjs/toolkit";
import { CategoryCombo, readCategoryCombos, saveCategoryCombos as saveCategoryCombosRepo } from "../../../Repository/CategoryComboRepository";
import { RootState } from "../../store";

interface CategoryCombosState {
    fetchStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    },
    saveStatus: {
        status: 'idle' | 'loading' | 'successful' | 'error'
        error: SerializedError | null
    }
    objects: CategoryCombo[],
}

const initialState: CategoryCombosState = {
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

export const fetchCategoryCombos = createAsyncThunk('categoryCombos/fetchCategoryCombos', async () => {
    return readCategoryCombos();
});

export const saveCategoryCombos = createAsyncThunk('categoryCombos/saveCategoryCombos', async (categoryCombos: CategoryCombo[]) => {
    await saveCategoryCombosRepo(categoryCombos);
    return categoryCombos;
})

export const categoryCombosSlice = createSlice({
    name: 'categoryCombos',
    initialState,
    reducers: {
    },
    extraReducers(builder) {
        builder
            .addCase(fetchCategoryCombos.pending, (state) => {
                state.fetchStatus = {
                    status: 'loading',
                    error: null
                };
            })
            .addCase(fetchCategoryCombos.fulfilled, (state, action) => {
                state.fetchStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addCase(fetchCategoryCombos.rejected, (state, action) => {
                state.fetchStatus = {
                    status: 'error',
                    error: action.error
                }
            })
            .addCase(saveCategoryCombos.pending, (state) => {
                state.saveStatus = {
                    status: 'loading',
                    error: null
                }
            })
            .addCase(saveCategoryCombos.fulfilled, (state, action) => {
                state.saveStatus = {
                    status: 'successful',
                    error: null
                }
                state.objects = action.payload;
            })
            .addCase(saveCategoryCombos.rejected, (state, action) => {
                state.saveStatus = {
                    status: 'error',
                    error: action.error
                }
            })
    }
})

export default categoryCombosSlice.reducer;

export const selectAllCategoryCombos = (state: RootState) => state.categoryCombos.objects;
export const selectFetchStatus = (state: RootState) => state.categoryCombos.fetchStatus;
export const selectSaveStatus = (state: RootState) => state.categoryCombos.saveStatus;
