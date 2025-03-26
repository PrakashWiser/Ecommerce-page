"use client";
import React, { useState, useEffect } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import { Container, Row, Col, Button, Badge } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Navbars from "@/app/user/components/Navbars";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";
import { showToast } from "@/app/user/components/ToastMessage";
import Loader from "@/app/user/components/Loader";
import Cookies from "js-cookie";
import { FaShopify, FaPlus, FaMinus } from "react-icons/fa";
import { useGlobalContext } from "@/app/api/providers/GlobalContext";
import Image from "next/image";
import Notfound from "@/app/assets/images/no-found.jpg";
import Link from "next/link";

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

const cleanPrice = (price) => {
  if (typeof price === "string") {
    return parseFloat(price.replace(/[^0-9.]/g, ""));
  }
  return price;
};

const Giturl =
  "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";
const MAX_QUANTITY = 10;

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params?.slug;
  const dispatch = useDispatch();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { cartItems, showCart } = useSelector((state) => state.cart);
  const { data: globalData, loading: globalLoading } = useGlobalContext();

  useEffect(() => {
    const userEmail = Cookies.get("Data") || "guest";
    dispatch(cartActions.initializeCart({ email: userEmail }));

    if (!productId) {
      setLoading(false);
      return;
    }

    if (globalData) {
      const foundProduct = globalData.find((item) => item.id == productId);
      setProduct(foundProduct);
      setLoading(false);
    }

    const userData = Cookies.get("Data");
    if (!userData) {
      showToast("Please Login", "error");
      setInterval(() => {
        router.push("/user/signin");
      }, 1500);
    }
  }, [globalData, router, productId, dispatch]);

  const handleAddToCart = debounce(() => {
    if (!product?.price) {
      showToast("Item price is missing!", "error");
      return;
    }

    const price = cleanPrice(product.price);
    const existingItem = cartItems.find((item) => item.id === product.id);

    try {
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > MAX_QUANTITY) {
          showToast(`Maximum quantity (${MAX_QUANTITY}) reached`, "error");
          return;
        }
        dispatch(
          cartActions.updateQuantity({
            id: product.id,
            newQuantity: newQuantity,
          })
        );
        showToast(`${quantity} more ${product.name} added to cart`, "success");
      } else {
        if (quantity > MAX_QUANTITY) {
          showToast(`Maximum quantity (${MAX_QUANTITY}) allowed`, "error");
          return;
        }
        const item = {
          ...product,
          price: price,
          quantity: quantity,
          totalPrice: price * quantity,
        };
        dispatch(
          cartActions.addCart({
            newItem: item,
          })
        );
        showToast(`${quantity} ${product.name} added to cart`, "success");
      }
      setQuantity(1);
    } catch (error) {
      showToast("Failed to update cart", "error");
      console.error("Add to cart error:", error);
    }
  }, 300);

  const handleBuyNow = () => {
    handleAddToCart();
    dispatch(cartActions.toggleCart());
  };

  const handleRemoveFromCart = (itemId) => {
    try {
      dispatch(
        cartActions.removeCart({
          itemId: itemId,
        })
      );
      showToast("Item removed from cart!", "success");
    } catch (error) {
      showToast("Failed to remove item", "error");
      console.error("Remove from cart error:", error);
    }
  };

  const toggleCart = () => {
    dispatch(cartActions.toggleCart());
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => {
        return total + cleanPrice(item.price) * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, MAX_QUANTITY));
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  if (loading || globalLoading) {
    return <Loader />;
  }

  if (!product) {
    return (
      <MainLayout>
        <Navbars />
        <Container className="my-5 py-5">
          <Row className="justify-content-center text-center">
            <Col md={8}>
              <Image
                src={Notfound}
                alt="Product not found"
                className="img-fluid rounded-4"
                width={500}
                height={400}
                priority
              />
              <h3 className="mt-4">Product Not Found</h3>
              <p className="text-muted mb-4">
                The product you\'re looking for doesn\'t exist or has been
                removed.
              </p>
              <Button
                variant="primary"
                as={Link}
                href="/"
                className="px-4 py-2"
              >
                Continue Shopping
              </Button>
            </Col>
          </Row>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Navbars />
      <Container className="my-4 my-md-5">
        <Row className="g-4">
          <Col md={6}>
            <div className="bg-light rounded-4 p-3 p-md-4 shadow-sm h-100">
              <div className="ratio ratio-1x1 position-relative">
                <Image
                  src={`${Giturl}${product.image}`}
                  alt={product.name}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="d-flex flex-column h-100">
              <Badge bg="secondary" className="align-self-start mb-3">
                {product.listingType}
              </Badge>

              <h1 className="mb-3 fw-bold">{product.name}</h1>

              <div className="d-flex align-items-center mb-4">
                <h2 className="text-primary mb-0">
                  ₹{cleanPrice(product.price).toFixed(2)}
                </h2>
                {product.originalPrice && (
                  <del className="text-muted ms-3 fs-5">
                    ₹{cleanPrice(product.originalPrice).toFixed(2)}
                  </del>
                )}
              </div>

              <div className="d-flex align-items-center mb-4">
                <span className="me-3 fw-medium">Quantity:</span>
                <Button
                  variant="outline-secondary"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="px-3 py-2"
                >
                  <FaMinus />
                </Button>
                <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                <Button
                  variant="outline-secondary"
                  onClick={increaseQuantity}
                  className="px-3 py-2"
                >
                  <FaPlus />
                </Button>
              </div>

              <div className="d-flex flex-wrap gap-3 mb-4">
                <Button
                  variant="primary"
                  onClick={handleAddToCart}
                  className="flex-grow-1 py-3"
                  size="lg"
                >
                  Add to Cart
                </Button>

                <Button
                  variant="warning"
                  className="text-white flex-grow-1 py-3"
                  size="lg"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </Button>

                <Button
                  variant="outline-primary"
                  className="position-relative p-3"
                  onClick={toggleCart}
                  aria-label="View cart"
                >
                  <FaShopify size={20} />
                  {cartItems.length > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartItems.reduce(
                        (total, item) => total + item.quantity,
                        0
                      )}
                    </span>
                  )}
                </Button>
              </div>

              <div className="mb-4">
                <h5 className="mb-3">Description</h5>
                <p className="text-muted">
                  {product.description || "No description available"}
                </p>
              </div>

              {product.listingType === "skateboard" && (
                <div className="mb-4">
                  <h5 className="mb-3">Features</h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Deck:</strong> 26 x 6.5, made of fiber for smooth
                      rides
                    </li>
                    <li className="mb-2">
                      <strong>Bearings & Wheels:</strong> High-precision ball
                      bearings, PVC wheels
                    </li>
                    <li className="mb-2">
                      <strong>Design:</strong> Unique graphics for style
                    </li>
                    <li>
                      <strong>Weight Capacity:</strong> Up to 75kg
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </Col>
        </Row>

        <Offcanvas show={showCart} onHide={toggleCart} placement="end">
          <Offcanvas.Header closeButton className="border-bottom">
            <Offcanvas.Title className="fw-bold">
              Your Shopping Cart (
              {cartItems.reduce((total, item) => total + item.quantity, 0)})
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className="d-flex flex-column">
            {cartItems.length === 0 ? (
              <div className="text-center my-auto py-5">
                <FaShopify size={48} className="text-muted mb-3" />
                <h5 className="mb-2">Your cart is empty</h5>
                <p className="text-muted mb-4">
                  Start shopping to add items to your cart
                </p>
                <Button variant="primary" onClick={toggleCart} className="px-4">
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-grow-1 overflow-auto">
                  {cartItems.map((item) => (
                    <div key={item.id} className="border-bottom pb-3 mb-3">
                      <div className="d-flex gap-3">
                        <div className="flex-shrink-0">
                          <Image
                            src={`${Giturl}${item.image}`}
                            alt={item.name}
                            width={80}
                            height={80}
                            className="rounded-3"
                          />
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1 fw-bold">{item.name}</h6>
                          <div className="d-flex justify-content-between mb-2">
                            <small className="text-muted">
                              ₹{cleanPrice(item.price).toFixed(2)} ×{" "}
                              {item.quantity}
                            </small>
                            <span className="fw-bold">
                              ₹
                              {(cleanPrice(item.price) * item.quantity).toFixed(
                                2
                              )}
                            </span>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="mt-1"
                          >
                            <RiDeleteBin5Line className="me-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-top pt-3 mt-auto">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Subtotal:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span>Shipping:</span>
                    <span className="text-success">FREE</span>
                  </div>
                  <div className="d-flex justify-content-between fw-bold fs-5 mb-4">
                    <span>Total:</span>
                    <span>₹{calculateTotal()}</span>
                  </div>

                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 py-3 fw-bold text-white"
                    as={Link}
                    href="/user/usershopcollection"
                  >
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            )}
          </Offcanvas.Body>
        </Offcanvas>
      </Container>
    </MainLayout>
  );
}
