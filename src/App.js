import React from "react";
import {
    Route,
    Routes,
    Link,
    useNavigate,
    Outlet,
    useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import data from "./dummy/data";

import Item from "./component/Item";
import Detail from "./component/Detail";
import Special from "./component/Special";
import Cart from "./component/Cart";

// react-query
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ContextAPI
export let Context1 = React.createContext();

function App() {
    // localStorage 이미 watched 항목이 있으면 [] 만들지 않도록 조건문 작성
    useEffect(() => {
        if (localStorage.length === 0) {
            localStorage.setItem("watched", JSON.stringify([]));
        }
    }, []);
    let [items] = useState(data);
    // console.log(items[0].title);
    const navigate = useNavigate();

    // react-query통해 서버에서 유저이름 가져와 보여주기
    let result = useQuery(
        ["user"],
        () =>
            axios
                .get("https://codingapple1.github.io/userdata.json")
                .then((a) => {
                    console.log("요청 중");
                    return a.data;
                })
        // { staleTime: 3000 } //타이머기능
    );

    // ContextAPI
    // const [store, setStore] = useState("불러 오는 중...");

    return (
        <div className="App">
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand
                        onClick={() => {
                            navigate("/");
                        }}
                    >
                        Mart
                    </Navbar.Brand>
                    <Nav className="me-auto">
                        <Nav.Link
                            onClick={() => {
                                navigate("/");
                            }}
                            style={{
                                color: "white",
                            }}
                        >
                            Home
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => {
                                navigate("/Special");
                            }}
                            style={{
                                color: "white",
                            }}
                        >
                            Special Price
                        </Nav.Link>
                        <Nav.Link
                            onClick={() => {
                                navigate("/Cart");
                            }}
                            style={{
                                color: "white",
                            }}
                        >
                            장바구니
                        </Nav.Link>
                        <Nav.Link>
                            {result.isLoading && "loading"}
                            {result.error && "error"}
                            {result.data && result.data.name}
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Item items={items} />} />
                <Route
                    path="/detail/:id/"
                    element={
                        // <Context1.Provider value={{ store }}>
                        <Detail items={items} />
                        // {" "}
                        // </Context1.Provider>
                    }
                >
                    <Route path="location" element={<div>상세페이지</div>} />
                </Route>
                <Route path="/special" element={<Special />} />
                <Route path="/cart" element={<Cart />} />
                {/* 이외에 모든 곳 */}
                {/* <Route path="*" element={<div>Not Found</div>} /> */}
            </Routes>
        </div>
    );
}

export default App;
