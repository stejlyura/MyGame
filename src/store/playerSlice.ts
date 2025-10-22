import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface PlayerState {
    name: string
    level: number
    attack: number
    health: number
}

const initialState: PlayerState = {
    name: 'Square',
    level: 1,
    attack: 10,
    health: 100,
}

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setPlayer(_state, action: PayloadAction<PlayerState>) {
            return action.payload
        },
        levelUp(state) {
            state.level += 1
        },
        takeDamage(state, action: PayloadAction<number>) {
            state.health = Math.max(0, state.health - action.payload)
        },
    },
})

export const { setPlayer, levelUp, takeDamage } = playerSlice.actions
export default playerSlice.reducer
