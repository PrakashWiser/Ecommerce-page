/** @jsxImportSource @emotion/react */
import { css, keyframes } from "@emotion/react";
import React from "react";

// Advanced animation keyframes
const orbit = keyframes`
  0% { transform: rotate(0deg) translateX(30px) rotate(0deg); }
  100% { transform: rotate(360deg) translateX(30px) rotate(-360deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.8); opacity: 0.7; }
`;

const wave = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0); }
`;

const gradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const containerStyle = css`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

const loaderStyle = css`
  position: relative;
  width: 120px;
  height: 120px;
`;

const centralOrbStyle = css`
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(45deg, #ff7e5f, #feb47b);
  background-size: 200% 200%;
  animation: ${pulse} 2s ease infinite, ${gradient} 6s ease infinite;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(255, 126, 95, 0.7);
`;

const orbitingDotStyle = css`
  position: absolute;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  animation: ${orbit} 2.4s linear infinite;
  top: 50%;
  left: 50%;
  margin-top: -8px;
  margin-left: -8px;
  box-shadow: 0 0 10px rgba(79, 172, 254, 0.7);
`;

const waveDotStyle = (delay) => css`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: linear-gradient(45deg, #a18cd1, #fbc2eb);
  animation: ${wave} 1.5s ease-in-out infinite;
  animation-delay: ${delay}s;
  bottom: -40px;
  left: 50%;
  margin-left: -6px;
`;

const textStyle = css`
  position: absolute;
  bottom: -70px;
  left: 0;
  width: 100%;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 300;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Loader = ({ message = "Loading..." }) => {
  return (
    <div css={containerStyle}>
      <div css={loaderStyle}>
        <div css={centralOrbStyle} />
        <div css={orbitingDotStyle} />
        {[0, 0.2, 0.4].map((delay, i) => (
          <div key={i} css={waveDotStyle(delay)} />
        ))}
        <div css={textStyle}>{message}</div>
      </div>
    </div>
  );
};

export default Loader;
