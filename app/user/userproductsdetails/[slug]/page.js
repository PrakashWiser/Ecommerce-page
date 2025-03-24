"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import { Container, Row, Col, Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbars from "@/app/user/components/Navbars";
import Modal from "react-bootstrap/Modal";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";
import { showToast } from "@/app/user/components/ToastMessage";
import Loader from "@/app/user/components/Loader";
import Cookies from "js-cookie";
import { FaShopify } from "react-icons/fa";
import { useGlobalContext } from "@/app/api/providers/GlobalContext";
import Image from "next/image";
import Notfound from "@/app/assets/images/no-found.jpg";
const cleanPrice = (price) => {
  if (typeof price === "string") {
    const numericPrice = price.replace(/[^0-9.]/g, "");
    return parseFloat(numericPrice);
  }
  return price;
};

function Blog({ params }) {
  const { slug: value } = params;
  const dispatch = useDispatch();
  const [APIData, setAPIData] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [cart, setCart] = useState(false);
  const [data, setData] = useState([]);
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  const { cartItems, showCart } = useSelector((state) => state.cart);
  const { data: globalData, loading: globalLoading } = useGlobalContext();

  useEffect(() => {
    if (globalData) {
      setAPIData(globalData);
      setLoading(false);
    }

    const Datas = Cookies.get("Data");
    if (!Datas) {
      router.push("/user/signin");
    } else {
      setData(Datas);
    }
  }, [globalData, router]);

  useEffect(() => {
    const filtered = APIData.filter((item) => item.id == value);
    setFilterData(filtered);
  }, [APIData, value]);
  const handleAddToCart = (selectedItem) => {
    if (!selectedItem.price) {
      showToast("Item price is missing!", "error");
      return;
    }

    const price = cleanPrice(selectedItem.price);

    const item = {
      ...selectedItem,
      price: price,
    };

    dispatch(cartActions.addCart(item));
    showToast("Your order has been successfully added", "success");
  };

  const handleRemoveFromCart = (itemId) => {
    dispatch(cartActions.removeCart(itemId));
    showToast("Item removed from cart!", "success");
  };

  const toggleCart = () => {
    dispatch(cartActions.toggleCart());
  };

  const calculateTotal = () => {
    if (!cartItems || cartItems.length === 0) {
      return "0.00";
    }

    const total = cartItems.reduce((accumulator, item) => {
      if (!item.price) {
        return accumulator;
      }

      const price = cleanPrice(item.price);
      return accumulator + price * item.quantity;
    }, 0);

    return total.toFixed(2);
  };


  if (loading || globalLoading) {
    return <Loader />;
  }

  return (
    <MainLayout>
      <Navbars />
      {data && (
        <Container>
          {filterData.length === 0 ? (
            <Row className="vh-100 align-items-center justify-content-center">
              <Col className="text-center">
                <div className="text-center  d-flex justify-content-center align-items-center flex-column">
                  <Image
                    src={Notfound}
                    alt="No data available"
                    className="rounded-pill img-fluid mx-auto"
                    style={{ maxWidth: "730px", margin: "20px 0" }}
                  />
                  <h3 className="mt-3">No items found</h3>
                </div>
              </Col>
            </Row>
          ) : (
            <Row className="vh-100 align-items-center justify-content-center prodcts_details">
              {filterData.map((item) => (
                <React.Fragment key={item.id}>
                  <Col md={5}>
                    {item.id === "37" ? (
                      <Image
                        src={`${Giturl}${item.image}`}
                        alt={item.name}
                        width={500}
                        height={500}
                        className="height_tybe"
                      />
                    ) : (
                      <Image
                        src={`${Giturl}${item.image}`}
                        alt={item.name}
                        width={500}
                        height={500}
                        className="img-fluid"
                      />
                    )}
                  </Col>
                  <Col md={7}>
                    <h2>{item.name}</h2>
                    <h5>Price: ₹{cleanPrice(item.price).toFixed(2)}</h5>
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
                    <div className="d-flex justify-content-between justify-content-md-start my-3 align-items-center gap-md-3">
                      <Button
                        variant="primary"
                        onClick={() => handleAddToCart(item)}
                        className="me-2 py-2"
                        aria-label="Add to cart"
                      >
                        Add to cart
                      </Button>

                      <Button
                        variant="warning"
                        className="py-2 px-3 text-white"
                        aria-label="Buy now"
                      >
                        Buy Now
                      </Button>
                      <FaShopify
                        onClick={toggleCart}
                        className={`fs-1 ${
                          cartItems.length > 0 ? "zoom-animation" : "primary_color"
                        }`}
                        style={{ cursor: "pointer" }}
                        aria-label="View cart"
                      />
                    </div>

                    <Offcanvas show={showCart} onHide={toggleCart}>
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
                                  ₹{cleanPrice(cartItem.totalPrice).toFixed(2)}
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
                          <h5>Total: ₹{calculateTotal()}</h5>
                        </div>
                      </Offcanvas.Body>
                    </Offcanvas>
                  </Col>
                </React.Fragment>
              ))}
            </Row>
          )}
        </Container>
      )}
    </MainLayout>
  );
}

export default Blog;
