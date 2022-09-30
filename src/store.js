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
            // state[action.payload].count += 1;
            state.map((a, i) => {
                if (a.id === action.payload) {
                    state[i].count++;
                }
            });

            let num = state.findIndex((a) => {
                return a == action.payload;
            });
            console.log("num");
            console.log(num);
        },
    },
});
export let { changeCount } = cart.actions;

export default configureStore({
    reducer: {
        user: user.reducer,
        cart: cart.reducer,
    },
});
