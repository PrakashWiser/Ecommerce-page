"use client";
import React, { useState, useEffect, use } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useRouter } from "next/navigation";
import Navbars from "@/app/components/Navbars";
import { RiDeleteBin5Line } from "react-icons/ri";
function Blog({ params }) {
  const { slug: value } = use(params);

  const [APIData, setAPIData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [cart, setCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [data, setData] = useState([]);
  const router = useRouter();
  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  useEffect(() => {
    const GetData = async () => {
      try {
        const response = await axios.get(
          `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`
        );
        setAPIData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    GetData();

    let Datas = localStorage.getItem("Data");
    if (Datas) {
      setData(Datas);
    } else {
      router.push("/signu");
    }

    const savedCart = localStorage.getItem("cartItems");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, [router]);

  useEffect(() => {
    const filtered = APIData.filter((item) => item.id == value);
    setFilterData(filtered);
  }, [APIData, value]);

  const handleShow = (selectedItem) => {
    console.log(selectedItem);

    setCart(true);
    const existingItem = cartItems.find(
      (cartItem) => cartItem.id === selectedItem.id
    );
    console.log(existingItem);

    if (existingItem) {
      alert("product already added");
    } else {
      const updatedCart = [...cartItems, selectedItem];
      setCartItems(updatedCart);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
    }
  };

  const handleBuyNow = (item) => {
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

    const total = cartItems.reduce((total, item) => {
      return total + (Number(item.price) || 0);
    }, 0);

    return total.toFixed(2);
  };

  return (
    <MainLayout>
      <Navbars />
      {data && (
        <Container>
          <Row className="vh-100 align-items-center justify-content-center prodcts_details">
            {filterData.map((item) => (
              <React.Fragment key={item.id}>
                <Col md={5}>
                  <img
                    src={`${Giturl}${item.image}`}
                    alt={item.name}
                    className="img-fluid"
                  />
                </Col>
                <Col md={7}>
                  <h2>{item.name}</h2>
                  <h5>Price: ${item.price}</h5>
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
                  {item.listingType === "clothing" && (
                    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                      <li>
                        Shirt Fabric: Soft Rayon, Multi-color, Short Sleeves.
                      </li>
                      <li>
                        Night Dress Set: Includes shirt & shorts, perfect for
                        sleep or beach wear.
                      </li>
                      <li>
                        Size: Select according to body requirements for the
                        perfect fit.
                      </li>
                    </ul>
                  )}
                  {item.listingType === "shoe" && (
                    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                      <li>Lightweight & breathable design for comfort.</li>
                      <li>
                        Non-slip & shockproof sole for durability and safety.
                      </li>
                      <li>Comfort sole for pain relief and easy walking.</li>
                    </ul>
                  )}
                  {item.listingType === "headphone" && (
                    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                      <li>
                        Personalized Spatial Audio with dynamic head tracking.
                      </li>
                      <li>Improved sound and call quality with the H2 chip.</li>
                      <li>
                        Long battery life with up to 30 hours of total listening
                        time.
                      </li>
                    </ul>
                  )}
                  {item.listingType === "mobile" && (
                    <ul style={{ listStyleType: "disc", marginLeft: "20px" }}>
                      <li>A16 Bionic chip for fast performance.</li>
                      <li>
                        Next-generation portrait mode for stunning photos.
                      </li>
                      <li>Advanced battery optimization for all-day usage.</li>
                    </ul>
                  )}

                  <div className="d-flex justify-content-between justify-content-md-start my-3">
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
                              <span className="fw-bold">${cartItem.price}</span>
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
        </Container>
      )}
    </MainLayout>
  );
}

export default Blog;
