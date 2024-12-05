"use client";
"use strict";
import React, { useEffect, useState, use } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Container } from "react-bootstrap";

const UpdatePro = ({ params }) => {
  const { slug: value } = use(params);
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [discription, setDiscription] = useState("");
  const [image, setImage] = useState("");
  const [listingType, setListingType] = useState("others");
  const [imageData, setImageData] = useState(null);
  const [admin, setAdmin] = useState();
  useEffect(() => {
    axios
      .get(`https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`)
      .then((getData) => {
        let data = getData.data;
        let filter = data.filter((items) => items.id == value);
        if (filter.length > 0) {
          setName(filter[0].name);
          setPrice(filter[0].price);
          setDiscription(filter[0].discription);
          setImage(filter[0].image);
          setListingType(filter[0].listingType);
        }
      });
    setAdmin(sessionStorage.getItem("Admin"));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedProduct = {
      name,
      price,
      discription,
      image: imageData ? imageData : image,
      listingType,
    };
    axios
      .put(
        `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products/${value}`,
        updatedProduct
      )
      .then(() => {
        setName("");
        setPrice("");
        setDiscription("");
        setImage("");
        setListingType("others");
        setImageData(null);
        router.push("/productsdetails");
      })
      .catch((error) => {
        console.error("Error updating product:", error);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageData(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  return (
    <Container>
      <div className="  vh-100 d-flex flex-column justify-content-center align-items-center">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <h2 className="mt-3 mb-4">Update Product</h2>
        </div>
        <form className="width_tybe" onSubmit={handleSubmit}>
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
            />
          </div>
          {imageData ? (
            <img
              src={imageData}
              alt="Selected"
              className="img-fluid mb-3"
              style={{ maxWidth: "200px" }}
            />
          ) : image ? (
            <img
              src={Giturl + image}
              alt="Current"
              className="img-fluid mb-3"
              style={{ maxWidth: "200px" }}
            />
          ) : null}

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
            <label htmlFor="discription" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="discription"
              rows={5}
              value={discription}
              onChange={(e) => setDiscription(e.target.value)}
              required
            ></textarea>
          </div>

          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Category
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
              <option value="headphone">Headphone</option>
              <option value="mobile">Mobile</option>
              <option value="others">Others</option>
            </select>
          </div>

          <button type="submit" className="btn btn-success">
            Update Product
          </button>
        </form>
      </div>
    </Container>
  );
};

export default UpdatePro;
