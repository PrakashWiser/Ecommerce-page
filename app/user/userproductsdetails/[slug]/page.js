"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbars from "@/app/user/components/Navbars";
import Modal from "react-bootstrap/Modal";
import { RiDeleteBin5Line } from "react-icons/ri";
import QrImg from "@/app/assets/images/qr-whatsapp.svg";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { cartActions } from "@/app/redux/cartSlice";
import Toast, { showToast } from "@/app/lib/toastfy/page";
import Loader from "@/app/user/components/Loader";
import Cookies from "js-cookie";
import { FaShopify } from "react-icons/fa";

function Blog({ params }) {
  const { slug: value } = params;
  const dispatch = useDispatch();
  const [APIData, setAPIData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [cart, setCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [data, setData] = useState([]);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await axios.get(
          `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`
        );
        setAPIData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    GetData();

    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    const Datas = Cookies.get("Data");
    if (!Datas) {
      router.push("/user/signin");
    } else {
      setData(Datas);
    }
  }, [router]);

  useEffect(() => {
    const filtered = APIData.filter((item) => item.id == value);
    setFilterData(filtered);
  }, [APIData, value]);

  const handleShow = (selectedItem) => {
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === selectedItem.id
    );
    if (existingItem) {
      showToast("You can view full details when the shop icon is clicked.");
    } else {
      const updatedCart = [...cartItems, selectedItem];
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      dispatch(cartActions.addCart(selectedItem));
      showToast("Your order has been successfully added", "success");
    }
  };

  const handleBuyNow = (item) => {
    setShow(true);
    const amount = item.price;
    console.log(`Redirecting to payment gateway with amount: $${amount}`);
  };

  const handleRemoveFromCart = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cartItems", JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return "0.00";
    }

    const total = cartItems.reduce((accumulator, item) => {
      const numericPrice = item.price.replace(/[^0-9.]/g, "");
      const price = parseFloat(numericPrice) || 0;
      console.log(`Item: ${item.name}, Price: ${price}`);
      return accumulator + price;
    }, 0);

    return total.toFixed(2);
  };

  const handleClose = () => setShow(false);

  if (loading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <Toast />
      <Navbars />
      {data && (
        <Container>
          {filterData.length === 0 ? (
            <Row className="vh-100 align-items-center justify-content-center">
              <Col className="text-center">
                <h3 className="mt-3">No items found</h3>
              </Col>
            </Row>
          ) : (
            <Row className="vh-100 align-items-center justify-content-center prodcts_details">
              {filterData.map((item) => (
                <React.Fragment key={item.id}>
                  <Col md={5}>
                    {item.id === "37" ? (
                      <img
                        src={`${Giturl}${item.image}`}
                        alt={item.name}
                        className="height_tybe"
                      />
                    ) : (
                      <img
                        src={`${Giturl}${item.image}`}
                        alt={item.name}
                        className="img-fluid"
                      />
                    )}
                  </Col>
                  <Col md={7}>
                    <h2>{item.name}</h2>
                    <h5>Price: {item.price}</h5>
                    <p>Category: {item.listingType}</p>
                    <p>Description: {item.discription}</p>
                    {item.listingType === "sketeboard" && (
                      <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                        <li>
                          Skateboard Deck: 26 x 6.5, made of fiber for smooth
                          rides.
                        </li>
                        <li>
                          Bearings & Wheels: High-precision ball bearings, PVC
                          wheels.
                        </li>
                        <li>Attractive Designs: Unique graphics for style.</li>
                        <li>Weight Capacity: Can handle up to 75kg.</li>
                      </ul>
                    )}
                    <div className="d-flex justify-content-between justify-content-md-start my-3 align-items-center gap-3">
                      <Button
                        variant="primary"
                        onClick={() => handleShow(item)}
                        className="me-2 py-2"
                      >
                        Add to cart
                      </Button>

                      <Button
                        variant="warning"
                        className="py-2 px-3 text-white"
                        onClick={() => handleBuyNow(item)}
                      >
                        Buy Now
                      </Button>
                      <FaShopify
                        onClick={() => setCart(true)}
                        className={`fs-1 ${
                          cartItems.length > 0 ? "zoom-animation" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      />
                    </div>

                    <Offcanvas show={cart} onHide={() => setCart(false)}>
                      <Offcanvas.Header closeButton>
                        <Offcanvas.Title>Order Products</Offcanvas.Title>
                      </Offcanvas.Header>
                      <Offcanvas.Body className="d-flex flex-column gap-3">
                        {cartItems.length > 0 ? (
                          cartItems.map((cartItem, index) => (
                            <div
                              key={index}
                              className="d-flex justify-content-between align-items-center border-bottom pb-2 mb-2"
                            >
                              <div>
                                <h6 className="mb-0">{cartItem.name}</h6>
                                <small>Category: {cartItem.listingType}</small>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <span className="fw-bold">
                                  {cartItem.price}
                                </span>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    handleRemoveFromCart(cartItem.id)
                                  }
                                  aria-label="Remove item"
                                >
                                  <RiDeleteBin5Line />
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>Your cart is empty</p>
                        )}
                        <div className="d-flex justify-content-between">
                          <h5>Total: ${calculateTotal()}</h5>
                        </div>
                      </Offcanvas.Body>
                    </Offcanvas>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          )}
          <Modal show={show} onHide={handleClose}>
            <div style={{ position: "relative" }}>
              <img src={QrImg.src} className="w-100" alt="QR code" />
              <RiDeleteBin5Line
                onClick={() => setShow(false)}
                style={{
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                  color: "red",
                }}
              />
            </div>
          </Modal>
        </Container>
      )}
    </MainLayout>
  );
}

export default Blog;
