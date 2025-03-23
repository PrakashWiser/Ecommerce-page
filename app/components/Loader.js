"use client";
import React from "react";
import { ClipLoader } from "react-spinners";

const Loader = () => {
  return (
    <div className="loader-container">
      <ClipLoader color="#007bff" size={100} />
      <style jsx>{`
        .loader-container {
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
        }

        /* Ensure the spinner is centered even on first load */
        :global(.loader-container > div) {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
        }
      `}</style>
    </div>
  );
};

export default Loader;
