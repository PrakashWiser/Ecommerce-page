import React, { useState, useEffect } from "react";
import { ReactSearchAutocomplete } from "react-search-autocomplete";
import axios from "axios";
import Link from "next/link";
function Searchbar() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await axios.get(
          `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    GetData();
  }, []);
  const handleOnSearch = (string, results) => {
    console.log(string, results);
  };

  const handleOnHover = (result) => {
    console.log(result);
  };

  const handleOnSelect = (items) => {
    console.log(items);
  };

  const handleOnFocus = () => {};

  const formatResult = (items) => {
    return (
      <>
        <Link href="/" style={{ display: "block", textAlign: "left" }}>
          {items.listingType}
        </Link>
      </>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: 250 }}>
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
      </header>
    </div>
  );
}

export default Searchbar;
