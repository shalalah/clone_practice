import { configureStore, createSlice } from "@reduxjs/toolkit";
// 파일 분할
import user from "./store/userSlice";

export let { changeName, increase } = user.actions;

let cart = createSlice({
    name: "cart",
    initialState: [
        { id: 0, name: "White and Black", count: 2 },
        { id: 2, name: "Grey Yordan", count: 1 },
    ],
    // state 변경하는 방법
    reducers: {
        changeCount(state, action) {
            let num = state.findIndex((item) => {
                return item.id === action.payload;
            });
            state[num].count += 1;
        },
        addState(state, action) {
            let find = state.findIndex((item) => {
                return item.id === action.payload.id;
            });

            if (find === -1) {
                state.push(action.payload);
            } else {
                state[find].count += 1;
            }
            // if (state[find].id === action.payload.id) {
            //     state[find].count += 1;
            // } else {
            //     state.push(action.payload);
            // }
            // state[find].id === action.payload.id
            //     ? (state[find].count += 1)
            //     : state.push(action.payload);
        },
        deleteItem(state, action) {
            let delIndex = state.findIndex((item) => {
                return item.id === action.payload;
            });
            state.splice(delIndex, 1);
        },
    },
});
export let { changeCount, addState, deleteItem } = cart.actions;

export default configureStore({
    reducer: {
        user: user.reducer,
        cart: cart.reducer,
    },
});
