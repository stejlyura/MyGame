import { configureStore } from '@reduxjs/toolkit'
import playerSlice from './playerSlice'

export const store = configureStore({
  reducer: {
    global: playerSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
