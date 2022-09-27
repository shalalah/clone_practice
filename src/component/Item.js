import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

import bg from "../assets/slide2.avif";

import styled from "styled-components";
import { useState } from "react";
const MainContainer = styled.div`
    position: relative;
`;
const MainBg = styled.div`
    height: 300px;
    background-image: url(${bg});
    background-size: cover;
    background-position: center;
    margin-bottom: 10px;
`;
const ItemImg = styled.img`
    width: 80%;
    margin-top: 20px;
`;
const ItemTitle = styled.h4``;
const Desc = styled.p``;

export default function Item(props) {
    const navigate = useNavigate();

    const [data, setData] = useState(props.items);
    // console.log(data);

    return (
        <MainContainer>
            <MainBg></MainBg>
            {/* title순으로 정렬 */}
            <Button
                variant="outline-info"
                onClick={() => {
                    let list = [...data];
                    list.sort((a, b) => {
                        // console.log(typeof a.title);
                        let A = a.title.toLowerCase();
                        let B = b.title.toLowerCase();
                        return A < B ? -1 : A == B ? 0 : 1;
                    });
                    setData(list);
                }}
            >
                정렬
            </Button>
            <Row>
                {data.length > 0 &&
                    data.map((item, idx) => (
                        <Col key={item.id}>
                            <ItemImg
                                src={item.src}
                                onClick={() => {
                                    navigate("/detail/" + `${item.id}`);
                                }}
                            ></ItemImg>
                            <ItemTitle>{item.title}</ItemTitle>
                            <Desc>{item.price}</Desc>
                        </Col>
                    ))}
            </Row>
        </MainContainer>
    );
}
