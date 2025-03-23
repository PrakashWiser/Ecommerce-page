"use client";
import React from "react";
import MainLayout from "@/app/Layout/MainLayout";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbars from "../components/Navbars";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/app/redux/cartSlice";
import { showToast } from "@/app/lib/toastfy/page";
import Embty from "@/app/assets/images/embty-data.webp";
import Image from "../components/Image";
function Shopcollection() {
  const collection = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();

  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  const handleRemoveFromCart = (id) => {
    dispatch(cartActions.removeCart(id));
    showToast("Item removed from cart!", "success");
  };

  return (
    <MainLayout>
      <Navbars />
      <h3 className="text-center my-5 text-decoration-underline">Your Items</h3>
      <Container>
        <Row className="align-items-center justify-content-center">
          {collection.length > 0 ? (
            collection.map((item, index) => (
              <React.Fragment key={index}>
                <Col md={5}>
                  <img
                    src={Giturl + item.image}
                    alt={`${item.name}-${index}`}
                    className="shop_collection img-fluid mb-3"
                  />
                </Col>
                <Col md={6}>
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                  <ul>
                    <li>Price: {item.price}</li>
                    <li>Type: {item.listingType}</li>
                    <li>Quantity: {item.quantity}</li>
                    <li>Total Price: {item.totalPrice}</li>
                  </ul>
                  <Button variant="info">Buy Now</Button>
                </Col>
                <Col md={1} className="d-flex align-items-center py-3 py-md-0">
                  <MdDelete
                    style={{ cursor: "pointer" }}
                    className="text-danger fs-1"
                    onClick={() => handleRemoveFromCart(item.id)}
                    title="Remove item"
                  />
                </Col>
              </React.Fragment>
            ))
          ) : (
            <div className="text-center w-100">
              <Image
                link={Embty}
                style={{ maxWidth: "300px", margin: "20px auto" }}
                alt="home-banner-img"
                styles="rounded-pill"
              />
              <p>No data available</p>
            </div>
          )}
        </Row>
      </Container>
    </MainLayout>
  );
}

export default Shopcollection;
