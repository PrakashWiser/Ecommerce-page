"use client";
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discription, setDiscription] = useState("");
  const [image, setImage] = useState("");
  const [imageData, setImageData] = useState("");
  const [listingType, setListingType] = useState("others");

  const router = useRouter();

  useEffect(() => {
    if (typeof document !== "undefined") {
    }
    document.title = "Page Not Found";
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post(`https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`, {
      name,
      price,
      discription,
      image,
      listingType,
    });

    setName("");
    setDiscription("");
    setPrice("");
    setImage("");
    setImageData("");
    setListingType("others");
    router.push("/admin/adminproductsdetails");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageData(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
      setImage(file.name);
    }
  };

  return (
    <div className="container form_width_tybe  vh-100 d-flex flex-column justify-content-center">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h2 className="mt-3 mb-4">Add New Products</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>
        {imageData && (
          <img
            src={imageData}
            alt="Selected"
            className="img-fluid mb-3"
            style={{ maxWidth: "200px" }}
          />
        )}
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="text"
            className="form-control"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="Discription" className="form-label">
            Discription
          </label>
          <textarea
            value={discription}
            rows={10}
            className="form-control"
            onChange={(e) => setDiscription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label htmlFor="category" className="form-label">
            Categories
          </label>
          <select
            className="form-control"
            id="category"
            value={listingType}
            onChange={(e) => setListingType(e.target.value)}
            required
          >
            <option value="sketeboard">Skateboard</option>
            <option value="clothing">Clothing</option>
            <option value="shoe">Shoe</option>
            <option value="headphone">HeadPhone</option>
            <option value="mobile">Mobiles</option>
            <option value="laptop">Laptop</option>
            <option value="others">Others</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          Add Listing
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
