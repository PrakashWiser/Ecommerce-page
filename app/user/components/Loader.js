/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import React from "react";
import { ClipLoader } from "react-spinners";

const loaderContainerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2); /* Subtle dark overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: auto;
  }
`;

const Loader = () => {
  return (
    <div css={loaderContainerStyle}>
      <ClipLoader color="#007bff" size={100} />
    </div>
  );
};

export default Loader;