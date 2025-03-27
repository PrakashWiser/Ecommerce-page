"use client";

import { useState, useEffect, memo, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Form,
  Button,
} from "react-bootstrap";
import { FiShoppingCart, FiMoon } from "react-icons/fi";
import { TbSkateboard } from "react-icons/tb";
import { MdLightMode } from "react-icons/md";
import Searchbar from "./Searchbar";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import Cookies from "js-cookie";
import { cartActions } from "@/app/api/redux/cartSlice";

const DropdownContent = memo(({ items }) => (
  <div className="d-md-flex">
    {items.map((section, index) => (
      <div key={index} className="me-3">
        {section.map((item, idx) => (
          <NavDropdown.Item
            href={item.href}
            key={idx}
            className="nav-dropdown-item"
          >
            <div>{item.title}</div>
            <p>{item.description}</p>
          </NavDropdown.Item>
        ))}
        {index < items.length - 1 && (
          <NavDropdown.Divider className="nav-dropdown-divider" />
        )}
      </div>
    ))}
  </div>
));
DropdownContent.displayName = "DropdownContent";

const CartIcon = memo(({ quantity, onClick }) => (
  <span className="position-relative">
    <FiShoppingCart
      style={{ cursor: "pointer" }}
      aria-label="Shopping Cart"
      size={24}
      onClick={onClick}
    />
    {quantity > 0 && (
      <span
        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-white"
        style={{ fontSize: "0.75rem", padding: "0.2em 0.6em" }}
      >
        {quantity}
      </span>
    )}
  </span>
));
CartIcon.displayName = "CartIcon";

const ThemeToggle = memo(({ theme, toggleTheme }) => (
  <Nav.Link className="my-2 my-md-0" onClick={toggleTheme}>
    {theme === "light" ? <MdLightMode size={24} /> : <FiMoon size={24} />}
  </Nav.Link>
));
ThemeToggle.displayName = "ThemeToggle";

function Navbars() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [theme, setTheme] = useState("light");
  const [sessionData, setSessionData] = useState(null);

  const cartQuantity = useSelector(
    (state) => state.cart?.cartItems?.length || 0,
    shallowEqual
  );

  useEffect(() => {
    const session = Cookies.get("Data") || Cookies.get("Admin");
    let email = "guest";
    if (session) {
      try {
        const parsedSession = JSON.parse(session);
        email = parsedSession.email || "guest";
      } catch (error) {
        console.warn(
          "Session is not valid JSON, treating as plain string:",
          session
        );
        email = session;
      }
    }
    dispatch(cartActions.initializeCart({ email }));
    setSessionData(session);
  }, [dispatch]);

  useEffect(() => {
    console.log("Cart quantity updated:", cartQuantity);
  }, [cartQuantity]);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.toggle("dark-mode", storedTheme === "dark");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  const handleCartClick = useCallback(() => {
    router.push("/user/usershopcollection");
  }, [router]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("Data");
    Cookies.remove("Admin");
    localStorage.clear(); 
    dispatch(cartActions.clearCart()); 
    setSessionData(null); 
    router.push("/"); 
  }, [router, dispatch]);

  const dropdownItems = useMemo(
    () => [
      [
        {
          href: "/admin/adminproductsdetails",
          title: "Admin Products Details",
          description: "Manage your products",
        },
      ],
    ],
    []
  );

  return (
    <Navbar expand="lg" className="bg-body-tertiary navbar text_black">
      <Container fluid>
        <Navbar.Brand className="fw600 d-flex gap-2" href="/">
          <TbSkateboard aria-label="Logo" />
          Skaters
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="https://ecommerce-dasboard.vercel.app/">
              Dashboard
            </Nav.Link>
            {sessionData && (
              <NavDropdown
                title="Admin Accessories"
                id="navbarScrollingDropdown"
                className="text-lg-center"
              >
                <DropdownContent
                  className="text-center"
                  items={dropdownItems}
                />
              </NavDropdown>
            )}
          </Nav>
          <Form className="d-md-flex align-items-center gap-4 my-3 my-lg-0">
            <Searchbar />
            <CartIcon quantity={cartQuantity} onClick={handleCartClick} />
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            {!sessionData ? (
              <Link
                href="/user/signin"
                className="btn rounded-pill bg_green text-white"
              >
                Sign in
              </Link>
            ) : (
              <Button className="border-0" onClick={handleLogout}>
                Sign out
              </Button>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default memo(Navbars);
