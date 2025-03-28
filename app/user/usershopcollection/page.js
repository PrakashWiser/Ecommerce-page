"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Spinner,
  Modal,
} from "react-bootstrap";
import Navbars from "../components/Navbars";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";
import { showToast } from "@/app/user/components/ToastMessage";
import Image from "next/image";
import Emptys from "@/app/assets/images/direct_empty_cart.webp";
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";
import Login from "@/app/user/signin/page";

const Giturl =
  "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

function ShopCollection() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const cartError = useSelector((state) => state.cart.lastError);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();

  const userData = Cookies.get("Data");
  const isLoggedIn = !!userData;

  useEffect(() => {
    const initializeCart = () => {
      try {
        console.log("Initializing cart");
        dispatch(cartActions.initializeCart());
        console.log("Cart initialized successfully");
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        showToast("Failed to load cart. Please refresh the page.", "error");
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, [dispatch]);

  useEffect(() => {
    if (!isLoading && cartError) {
      showToast(`Cart error: ${cartError}`, "error");
    }
  }, [isLoading, cartError]);

  const getTotalPrice = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const handleRemoveFromCart = (id) => {
    try {
      dispatch(cartActions.removeCart({ itemId: id }));
      showToast("Item removed from cart!", "success");
    } catch (error) {
      showToast("Failed to remove item.", "error");
    }
  };

  const handleIncrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      try {
        dispatch(
          cartActions.updateQuantity({
            id: item.id,
            newQuantity: item.quantity + 1,
          })
        );
        showToast("Quantity increased!", "success");
      } catch (error) {
        showToast("Failed to update quantity.", "error");
      }
    }
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      try {
        if (item.quantity > 1) {
          dispatch(
            cartActions.updateQuantity({
              id: item.id,
              newQuantity: item.quantity - 1,
            })
          );
          showToast("Quantity decreased!", "success");
        } else {
          handleRemoveFromCart(id);
        }
      } catch (error) {
        showToast("Failed to update quantity.", "error");
      }
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowOrderModal(true);
    } catch (error) {
      console.error("Checkout error:", error);
      showToast("Checkout failed. Please try again.", "error");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmOrder = () => {
    try {
      setShowOrderModal(false);
      dispatch(cartActions.clearCart());
      showToast("Order placed successfully!", "success");
    } catch (error) {
      showToast("Failed to clear cart.", "error");
    }
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    handleCheckout();
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Navbars />
        <Container className="my-4 min-vh-100 text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Navbars />
      <Container className="my-4 min-vh-100">
        {cartItems.length > 0 ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0 primary_color fw-bold">Your Shopping Cart</h2>
              <h3 className="mb-0 primary_color fw-bold">
                Total: ₹{getTotalPrice().toFixed(2)}
              </h3>
            </div>

            <Row>
              <Col md={8}>
                {cartItems.map((item) => (
                  <Card key={item.id} className="mb-3 shadow-sm">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={3} xs={4}>
                          <div
                            className="position-relative"
                            style={{ height: "120px" }}
                          >
                            <Image
                              src={`${Giturl}${item.image}`}
                              alt={item.name}
                              fill
                              className="img-fluid rounded object-fit-cover"
                              sizes="(max-width: 768px) 100px, 200px"
                              onError={() =>
                                console.error(
                                  `Failed to load image: ${item.image}`
                                )
                              }
                            />
                          </div>
                        </Col>
                        <Col md={5} xs={8}>
                          <Card.Title className="fw-bold">
                            {item.name || "Unnamed Item"}
                          </Card.Title>
                          <Card.Text className="text-muted mb-1">
                            Category: {item.listingType || "N/A"}
                          </Card.Text>
                          <Card.Text className="fw-bold text-muted mb-2">
                            Price: ₹{(item.price || 0).toFixed(2)}
                          </Card.Text>
                          <Button
                            variant="info"
                            className="text-white"
                            size="sm"
                            as={Link}
                            href={`/product/${item.id}`}
                          >
                            View Details
                          </Button>
                        </Col>
                        <Col md={4} className="text-end mt-3 mt-md-0">
                          <div className="d-flex align-items-center justify-content-end mb-2">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="px-3"
                              onClick={() => handleDecrement(item.id)}
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus />
                            </Button>
                            <span className="mx-3 fw-bold">
                              {item.quantity || 0}
                            </span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              className="px-3"
                              onClick={() => handleIncrement(item.id)}
                              aria-label="Increase quantity"
                            >
                              <FaPlus />
                            </Button>
                          </div>
                          <Card.Text className="fw-bold">
                            Total: ₹{(item.price * item.quantity).toFixed(2)}
                          </Card.Text>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="mt-2"
                            aria-label="Remove item"
                          >
                            <MdDelete className="me-1" /> Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
              <Col md={4}>
                <Card className="shadow-sm sticky-top" style={{ top: "20px" }}>
                  <Card.Body>
                    <Card.Title className="fw-bold mb-4">
                      Order Summary
                    </Card.Title>
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        Subtotal (
                        {cartItems.reduce(
                          (sum, item) => sum + item.quantity,
                          0
                        )}{" "}
                        items)
                      </span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span>Discount</span>
                      <span className="text-success">-₹0.00</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span>Shipping</span>
                      <span className="text-success">FREE</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                      <span>Total</span>
                      <span>₹{getTotalPrice().toFixed(2)}</span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-100 mt-3 flash-hover-btn white-btn"
                      onClick={handleCheckout}
                      disabled={isProcessing || cartItems.length === 0}
                    >
                      {isProcessing ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Processing...
                        </>
                      ) : (
                        "Place Order"
                      )}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <div className="text-center py-5">
            <Image
              src={Emptys}
              alt="Empty cart"
              width={300}
              height={300}
              className="img-fluid mb-4"
              priority
            />
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven't added anything to your cart yet
            </p>
            <Button variant="primary" className="text-white" href="/" as={Link}>
              Continue Shopping
            </Button>
          </div>
        )}

        <Modal
          show={showLoginModal}
          onHide={() => setShowLoginModal(false)}
          centered
          dialogClassName="custom-modal"
          contentClassName="custom-modal-content"
        >
          <div
            className="modal-inner-container"
            style={{
              width: "100%",
              maxWidth: "500px",
              padding: "20px",
              backgroundColor: "white",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              overflowY: "auto",
            }}
          >
            <Login
              onLoginSuccess={handleLoginSuccess}
              compact={true}
              pathName={true} 
            />
          </div>
        </Modal>

        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fw-bold mb-3">
              Your order has been placed successfully!
            </p>
            <div className="mb-3">
              <p>Order Summary:</p>
              <ul className="list-unstyled">
                <li>Total Items: {cartItems.length}</li>
                <li>Order Total: ₹{getTotalPrice().toFixed(2)}</li>
                <li>Estimated Delivery: 3-5 business days</li>
              </ul>
            </div>
            <p>Thank you for your purchase!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={confirmOrder}>
              Continue Shopping
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
}

export default ShopCollection;
