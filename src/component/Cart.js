import React from "react";
import styled from "styled-components";

import { Table, Button } from "react-bootstrap";
// state 가져오기, 변경함수 가져오기
import { useSelector, useDispatch } from "react-redux";
//state변경함수 가져오기
import { changeName, increase, changeCount, deleteItem } from "../store";

export default function Cart() {
    let state = useSelector((state) => state);
    // console.log(state);
    // 객체 - 비구조화 문법
    let { cart, user } = state;
    const dispatch = useDispatch();

    return (
        <CartContainer>
            <div>
                {user.name}님
                <Button
                    variant="outline-info"
                    onClick={() => {
                        dispatch(changeName());
                    }}
                >
                    이름 변경
                </Button>
                {user.age}
                <Button
                    variant="outline-info"
                    onClick={() => {
                        dispatch(increase(1));
                    }}
                >
                    나이 변경
                </Button>
            </div>
            <Table responsive style={{ marginTop: "20px" }}>
                {/* table head 제목 부분 */}
                <thead>
                    {/* tr 가로줄, th 와 td 넣으면 열 하나 생김 */}
                    <tr>
                        <th className="tableTitle">상품번호</th>
                        <th className="tableTitle">상품명</th>
                        <th className="tableTitle">수량</th>
                        <th className="tableTitle">추가하기</th>
                        <th className="tableTitle">삭제하기</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((item, i) => (
                        // console.log(item.id);
                        <tr key={item.id}>
                            <td className="tableTitle">{item.id}</td>
                            <td className="tableTitle">{item.name}</td>
                            <td className="tableTitle">{item.count}</td>
                            <td className="tableTitle">
                                <Button
                                    variant="outline-info"
                                    onClick={() => {
                                        dispatch(changeCount(item.id));
                                    }}
                                >
                                    +
                                </Button>
                            </td>
                            <td className="tableTitle">
                                <Button
                                    variant="outline-info"
                                    onClick={() => {
                                        dispatch(deleteItem(item.id));
                                    }}
                                >
                                    x
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </CartContainer>
    );
}
const CartContainer = styled.div`
    max-width: 1050px;
    margin: 0 auto;
    padding-top: 25px;
    .tableTitle {
        text-align: center;
    }
`;
