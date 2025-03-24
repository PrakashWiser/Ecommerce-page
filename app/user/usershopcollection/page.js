"use client";
import React from "react";
import MainLayout from "@/app/Layout/MainLayout";
import { Container, Row, Col, Button } from "react-bootstrap";
import Navbars from "../components/Navbars";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";
import { showToast } from "@/app/user/components/ToastMessage";
import Image from "next/image";
import Notfound from "@/app/assets/images/no-found.jpg";

function Shopcollection() {
  const collection = useSelector((state) => state.cart.cartItems);
  console.log("Cart Items in Component:", collection);

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
      {collection.length > 0 && (
        <h3 className="text-center my-5 text-decoration-underline">
          Your Items
        </h3>
      )}
      <Container>
        <Row className="align-items-center justify-content-center">
          {collection.length > 0 ? (
            collection.map((item, index) => (
              <React.Fragment key={index}>
                <Col md={5}>
                  <Image
                    src={Giturl + item.image}
                    alt={`${item.name}-${index}`}
                    width={500}
                    height={500}
                    className="shop_collection img-fluid mb-3"
                  />
                </Col>
                <Col md={6}>
                  <div>
                    <strong>{item.name}</strong>
                  </div>
                  <ul>
                    <li>Price: ₹{item.price.toFixed(2)}</li>
                    <li>Type: {item.listingType}</li>
                    <li>Quantity: {item.quantity}</li>
                    <li>Total Price: ₹{item.totalPrice.toFixed(2)}</li>
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
            <div className="text-center  d-flex justify-content-center align-items-center flex-column">
              <Image
                src={Notfound}
                alt="No data available"
                className="rounded-pill img-fluid mx-auto"
                style={{ maxWidth: "730px", margin: "20px 0" }}
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
