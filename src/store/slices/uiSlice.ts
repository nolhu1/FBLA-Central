import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  aiPanelOpen: boolean;
  lastError?: string | null;
}

const initialState: UIState = {
  aiPanelOpen: false,
  lastError: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setAiPanelOpen(state, action: PayloadAction<boolean>) {
      state.aiPanelOpen = action.payload;
    },
    setLastError(state, action: PayloadAction<string | null>) {
      state.lastError = action.payload;
    }
  }
});

export const { setAiPanelOpen, setLastError } = uiSlice.actions;
export default uiSlice.reducer;
