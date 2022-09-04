import { createSlice } from "@reduxjs/toolkit";
import { CategoryCombo } from "../../../Repository/CategoryComboRepository";


// Define a type for the slice state
interface CategoryCombosState {
    objects: CategoryCombo[]
}

// Define the initial state using that type
const initialState: CategoryCombosState = {
    objects: []
}

export const categoryCombosSlice = createSlice({
    name: 'categoryCombos',
    initialState,
    reducers: {

    }
})

export default categoryCombosSlice.reducer;
