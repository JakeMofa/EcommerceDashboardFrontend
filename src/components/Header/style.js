import styled from "styled-components";

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 999;
  box-shadow: 0px 0px 20px 20px #0000000d;
  background: #2a2a2a;
  .arrow {
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 32px;
    color: #000;
    padding-left: 7px;
    box-shadow: 0px 0px 10px #d2d2d2;
    position: absolute;
    left: -15px;
    padding-top: 5px;
    cursor: pointer;
    svg,
    span {
      cursor: pointer;
    }
  }
`;

export default Wrapper;
