"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await axios.get(
          "https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products"
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    GetData();
  }, []);

  return (
    <GlobalContext.Provider value={{ data, loading }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
