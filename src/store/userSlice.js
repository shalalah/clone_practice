import { createSlice } from "@reduxjs/toolkit";

let user = createSlice({
    name: "user",
    initialState: { name: "kim", age: 20 },
    // state 변경하는 방법
    reducers: {
        changeName(state) {
            state.name = "park";
        },
        increase(state, action) {
            state.age += action.payload;
        },
    },
});
export default user;
