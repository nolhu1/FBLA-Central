import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { User } from "@/domain/models/types";

interface SessionState {
  user: User | null;
  isBootstrapped: boolean;
}

const initialState: SessionState = {
  user: null,
  isBootstrapped: false
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    setBootstrapped(state, action: PayloadAction<boolean>) {
      state.isBootstrapped = action.payload;
    }
  }
});

export const { setUser, setBootstrapped } = sessionSlice.actions;
export default sessionSlice.reducer;
