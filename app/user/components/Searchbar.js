"use client";
import React, { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import { useRouter } from "next/navigation";

function Searchbar() {
  const [items, setItems] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const cachedData = sessionStorage.getItem("searchItems");

    if (cachedData) {
      setItems(JSON.parse(cachedData));
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products"
          );
          setItems(response.data);
          sessionStorage.setItem("searchItems", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, []);

  const handleOnSearch = (query, results) => {
    console.log("Search Query:", query);
    console.log("Search Results:", results);
  };

  const handleOnHover = (result) => {
    console.log("Hovered Result:", result);
  };

  const handleOnSelect = (item) => {
    console.log("Selected Item:", item);
    router.push(`/user/userproductsdetails/${item.id}`);
  };

  const handleOnFocus = () => {
    console.log("Input Focused");
  };

  const formatResult = (item) => (
    <div style={{ display: "block", textAlign: "left" }}>{item.name}</div>
  );

  const styling = {
    zIndex: 9999,
    position: "relative",
    backgroundColor: "white",
    border: "1px solid #ddd",
    borderRadius: "4px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  };

  return (
    <div className="text-center position-relative" style={{ zIndex: 9999 }}>
      <div
        className="pb-3 pb-md-0 searchbar-container"
        style={{
          position: "relative",
          margin: "0 auto",
        }}
      >
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          formatResult={formatResult}
          placeholder="Search Products"
          styling={styling}
        />
      </div>
    </div>
  );
}

export default Searchbar;
