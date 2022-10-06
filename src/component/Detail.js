import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "../Detail.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";

// Context API 로 store 가져오기
// import { Context1 } from "../App";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import { addState } from "../store";
import CurrentItems from "./CurrentItems";

const DetailPage = styled.div`
    height: 100px;
`;
const YellowBox = styled.div` 
    background-color: yellow;
    width: 80%;
    height: 30px;
    margin 0 auto;
`;

const Detail = (props) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // let { store } = useContext(Context1); // 보관함해체
    const [count, setCount] = useState(0);
    const [appear, setAppear] = useState(true);
    const [num, setNum] = useState("");
    // 애니메이션 효과
    const [fade, setFade] = useState("");

    // 탭 상태 저장해 둘 state 필요
    const [tab, setTab] = useState(0);

    useEffect(() => {
        setTimeout(() => {
            setAppear(false);
            setFade("end");
        }, 1000);
        if (isNaN(num) == true) {
            alert("숫자만 입력하세요");
        }
    }, [num]);

    const { id } = useParams();
    // console.log(id);
    // 데이터 자료에서 고유의 값으로 상품 상세페이지 이동할 수 있도록 find()함수 사용
    const product = props.items.find((x) => x.id == id);
    // console.log(product);

    // localStorage - array/obj 의 경우 JSON 사용해서 저장해줘야함
    useEffect(() => {
        //수정하기 위해 꺼내기 , 꺼낸 것을 변수에 저장
        let currentList = localStorage.getItem("watched");
        // console.log(typeof currentList); string으로 출력
        currentList = JSON.parse(currentList);
        // console.log(currentList); 배열로 출력
        currentList.push(product.id);
        // set 자료형
        currentList = new Set(currentList);
        // Array.from() 메서드
        currentList = Array.from(currentList);
        localStorage.setItem("watched", JSON.stringify(currentList));
    }, []);

    return (
        <DetailPage>
            {/* {appear === true ? <YellowBox>{store}</YellowBox> : null} */}
            <div className={`start ${fade}`}>
                <Col>
                    <Card>
                        <Card.Img
                            variant="top"
                            src={product.src}
                            alt="이미지"
                            style={{
                                padding: "5px",
                                margin: "0 auto",
                                width: "30%",
                            }}
                        />
                        <Card.Body
                            style={{
                                margin: "0 auto",
                            }}
                        >
                            <Card.Title>{product.title}</Card.Title>
                            <Card.Text>{product.content}</Card.Text>
                            <Card.Text>{product.price}</Card.Text>
                            <Card.Text>
                                <input
                                    onChange={(e) => setNum(e.target.value)}
                                />
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Button
                    variant="warning"
                    onClick={() => {
                        dispatch(
                            addState({
                                id: product.id,
                                name: product.title,
                                count: 1,
                            })
                        );
                        setCount(count + 1);
                        navigate("/detail/" + `${id}` + "/location");
                    }}
                >
                    장바구니 : {count}
                </Button>
                <Outlet></Outlet>
                {/* 탭 만들기 */}
                <Nav variant="tabs" defaultActiveKey="link0">
                    <Nav.Item>
                        <Nav.Link
                            eventKey="link0"
                            onClick={() => {
                                setTab(0);
                            }}
                        >
                            상품설명
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="link1"
                            onClick={() => {
                                setTab(1);
                            }}
                        >
                            가격
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            eventKey="link2"
                            onClick={() => {
                                setTab(2);
                            }}
                        >
                            상세설명
                        </Nav.Link>
                    </Nav.Item>
                </Nav>
                <TabContent tab={tab} items={product} />
            </div>
            <CurrentItems data={props.items} />
        </DetailPage>
    );
};

function TabContent({ tab, items }) {
    // console.log(items.title);
    // let { store } = useContext(Context1); // props대신에 사용하 수 있는 contextAPI
    // console.log(store);
    return [
        <div>{items.title}</div>,
        <div>{items.price}</div>,
        <div>{items.content}</div>,
    ][tab];
}

export default Detail;
