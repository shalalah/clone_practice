import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Button from "react-bootstrap/Button";
import "../Detail.css";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";

import styled from "styled-components";

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
        }, 2000);
        if (isNaN(num) == true) {
            alert("숫자만 입력하세요");
        }
    }, [num]);

    const { id } = useParams();
    // console.log(id);
    // 데이터 자료에서 고유의 값으로 상품 상세페이지 이동할 수 있도록 find()함수 사용
    const product = props.items.find((x) => x.id == id);
    // console.log(product);

    return (
        <DetailPage>
            <div className={`start ${fade}`}>
                {appear === true ? (
                    <YellowBox>2초 이내 구매시 할인</YellowBox>
                ) : null}
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
        </DetailPage>
    );
};

function TabContent({ tab, items }) {
    // console.log(items.title);
    return [
        <div>{items.title}</div>,
        <div>{items.price}</div>,
        <div>{items.content}</div>,
    ][tab];
}

export default Detail;
