import {
    Route,
    Routes,
    Link,
    useNavigate,
    Outlet,
    useParams,
} from "react-router-dom";
import { useState } from "react";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import data from "./dummy/data";

import Item from "./component/Item";
import Detail from "./component/Detail";
import Special from "./component/Special";

function App() {
    let [items] = useState(data);
    // console.log(items[0].title);
    const navigate = useNavigate();

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
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route path="/" element={<Item items={items} />} />
                <Route path="/detail/:id/" element={<Detail items={items} />}>
                    <Route path="location" element={<div>상세페이지</div>} />
                </Route>
                <Route path="/special" element={<Special />} />
                {/* 이외에 모든 곳 */}
                {/* <Route path="*" element={<div>Not Found</div>} /> */}
            </Routes>
        </div>
    );
}

export default App;
