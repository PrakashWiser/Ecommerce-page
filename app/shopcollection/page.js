"use client";
import React, { useEffect, useState } from "react";
import MainLayout from "../Layout/MainLayout";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbars from "../components/Navbars";
import { MdDelete } from "react-icons/md";
function Shopcollection() {
  const [collection, setCollection] = useState([]);
  useEffect(() => {
    const collection1 = localStorage.getItem("cartItems");
    if (collection1) {
      setCollection(JSON.parse(collection1));
    }
  }, []);

  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  const handleClick = (id) => {
    const updatedCollection = collection.filter((item) => item.id !== id);
    setCollection(updatedCollection);

    localStorage.setItem("cartItems", JSON.stringify(updatedCollection));
  };

  return (
    <MainLayout styles="py-5">
      <Container>
        <Navbars />
        <h3 className="text-center my-5 text-decoration-underline">
          Your Buy Now Products
        </h3>
        <Row className="align-items-center justify-content-center">
          {collection.length > 0 ? (
            collection.map((item, index) => (
              <React.Fragment key={index}>
                <Col md={5}>
                  <img
                    src={Giturl + item.image}
                    alt={`${item.name}-${index}`}
                    className="shop_collection img-fluid"
                  />
                </Col>
                <Col md={6}>
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                  <ul>
                    <li>Price: {item.price}</li>
                    <li>Type: {item.listingType}</li>
                  </ul>
                  <Button variant="info">Buy Now</Button>
                </Col>
                <Col md={1} className="d-flex align-items-center py-3 py-md-0">
                  <MdDelete
                    className="text-danger fs-1 cursor-pointer"
                    onClick={() => handleClick(item.id)}
                    title="Remove item"
                  />
                </Col>
              </React.Fragment>
            ))
          ) : (
            <div>No items in the collection.</div>
          )}
        </Row>
      </Container>
    </MainLayout>
  );
}

export default Shopcollection;
