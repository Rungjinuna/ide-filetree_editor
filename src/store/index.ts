import { configureStore } from "@reduxjs/toolkit"
import fileTreeReducer from "./filetree/fileTreeSlice"

export const store = configureStore({
  reducer: {
    files: fileTreeReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
