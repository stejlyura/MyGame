import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface GlobalState {
  data: Record<string, any>
}

const initialState: GlobalState = {
  data: {}, // глобальный объект
}

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setData(state, action: PayloadAction<Record<string, any>>) {
      state.data = action.payload
    },
    updateKey(state, action: PayloadAction<{ key: string; value: any }>) {
      state.data[action.payload.key] = action.payload.value
    },
  },
})

export const { setData, updateKey } = globalSlice.actions
export default globalSlice.reducer
