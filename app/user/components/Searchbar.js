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
    router.push(`/userproductsdetails/${item.id}`);
  };

  const handleOnFocus = () => {
    console.log("Input Focused");
  };

  const formatResult = (item) => (
    <div style={{ display: "block", textAlign: "left" }}>
      {item.name}
    </div>
  );

  return (
    <div>
      <div style={{ width: 350 }}>
        <ReactSearchAutocomplete
          items={items}
          onSearch={handleOnSearch}
          onHover={handleOnHover}
          onSelect={handleOnSelect}
          onFocus={handleOnFocus}
          autoFocus
          formatResult={formatResult}
          placeholder="Search Products"
        />
      </div>
    </div>
  );
}

export default Searchbar;
