import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import styled from "styled-components";

export default function CurrentItems(props) {
    const navigate = useNavigate();
    let [current, setCurrent] = useState([]);

    useEffect(() => {
        let currentList = localStorage.getItem("watched");
        currentList = JSON.parse(currentList);
        setCurrent(currentList);
    }, []);
    // console.log(current);

    return (
        <CurrentContainer>
            <div className="title">최근 본 상품</div>
            <Nav className="flex-column">
                {current == null
                    ? console.log("최근 본 상품이 없어요")
                    : current.map((item, idx) => {
                          const items = props.data.find(
                              (x) => x.id == current[idx]
                          );
                          //   console.log(items.src);
                          return (
                              <Nav.Link key={idx}>
                                  <CurrentImg
                                      src={items.src}
                                      alt=""
                                      onClick={() => {
                                          navigate("/detail/" + `${items.id}`);
                                      }}
                                  />
                                  {/* {current[idx]} */}
                              </Nav.Link>
                          );
                      })}
            </Nav>
        </CurrentContainer>
    );
}
const CurrentContainer = styled.div`
    position: absolute;
    right: 20px;
    top: 400px;
    .title {
        font-size: 12px;
        padding: 5px;
        text-align: center;
    }
    .flex-column {
        border: 1px solid rgb(221, 221, 221);
        background-color: rgb(255, 255, 255);
        text-align: center;
    }
`;
const CurrentImg = styled.img`
    width: 30px;
    height: 40px;
`;
