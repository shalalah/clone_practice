import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useNavigate, Outlet, useParams } from "react-router-dom";

import styled from "styled-components";

const DetailPage = styled.div`
    height: 100px;
`;
const YellowBox = styled.div`
    background-color: yellow;
    width: 100px;
    height: 30px;
`;

const Detail = (props) => {
    useEffect(() => {
        let time = setTimeout(() => {
            setAppear(false);
        }, 2000);
        console.log(2);
        return () => {
            clearTimeout(time);
            console.log(1);
        };
    }, []);

    const navigate = useNavigate();

    const [count, setCount] = useState(0);
    const [appear, setAppear] = useState(true);

    const { id } = useParams();
    // console.log(id);
    // 데이터 자료에서 고유의 값으로 상품 상세페이지 이동할 수 있도록 find()함수 사용
    const product = props.items.find((x) => x.id == id);
    // console.log(product);

    return (
        <DetailPage>
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
                    <Card.Body>
                        <Card.Title>{product.title}</Card.Title>
                        <Card.Text>{product.content}</Card.Text>
                        <Card.Text>{product.price}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
            {appear == true ? <YellowBox>2초 후 사라짐</YellowBox> : null}
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
        </DetailPage>
    );
};

export default Detail;
