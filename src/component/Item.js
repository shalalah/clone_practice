import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import bg from "../assets/slide2.avif";
import { Row, Col, Button } from "react-bootstrap";
import styled from "styled-components";
import CurrentItems from "./CurrentItems";

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
const MainWrapper = styled.div`
    margin: 0 auto;
    max-width: 1500px;
    text-align: center;
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
            <MainWrapper>
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
                <Row style={{ maxWidth: "1050px", margin: "0 auto" }}>
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
                <Button
                    variant="light"
                    onClick={() => {
                        axios
                            .get(
                                "https://codingapple1.github.io/shop/data2.json"
                            )
                            .then((server) => {
                                console.log(server);
                                let list = [...data, ...server.data];
                                setData(list);
                            })
                            .catch(() => {
                                console.log("실패");
                            });
                    }}
                >
                    더 보기
                </Button>
            </MainWrapper>
            <CurrentItems data={data} />
        </MainContainer>
    );
}
