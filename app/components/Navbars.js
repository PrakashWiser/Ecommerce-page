"use client";

import { useState, useEffect, memo } from "react";
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

function Navbars() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [sessionData, setSessionData] = useState(null);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    const storedCart = localStorage.getItem("cartItems");
    const session = localStorage.getItem("Data");

    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.toggle("dark-mode", storedTheme === "dark");
    }

    if (storedCart) {
      setCartQuantity(JSON.parse(storedCart).length || 0);
    }

    if (session) {
      setSessionData(session);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("dark-mode", theme === "dark");
  }, [theme]);

  const handleLogout = () => {
    localStorage.clear();
    setSessionData(null);
    router.push("/");
  };

  const dropdownItems = [
    [
      {
        href: "/",
        title: "Products",
        description: "All the products we have to offer",
      },
    ],
    [
      {
        href: "/adminproductsdetails",
        title: "Create Store",
        description: "Start selling products",
      },
    ],
  ];

  return (
    <Navbar
      expand="lg"
      className="bg-body-tertiary navbar sticky-top text_black"
    >
      <Container fluid>
        <Navbar.Brand className="fw600 d-flex gap-2" href="/">
          <TbSkateboard aria-label="Logo" />
          Skaters
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            <Nav.Link href="/">Home</Nav.Link>
            <NavDropdown title="Categories" id="navbarScrollingDropdown">
              <DropdownContent items={dropdownItems} />
            </NavDropdown>
            <Nav.Link href="https://ecommerce-dasboard.vercel.app/">
              Dashboard
            </Nav.Link>
          </Nav>
          <Form className="d-md-flex align-items-center gap-3">
            <Searchbar />
            <span className="position-relative">
              <FiShoppingCart
                style={{ cursor: "pointer" }}
                aria-label="Shopping Cart"
                size={24}
                onClick={() => router.push("/usershopcollection")}
              />
              {cartQuantity > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-white"
                  style={{ fontSize: "0.75rem", padding: "0.2em 0.6em" }}
                >
                  {cartQuantity}
                </span>
              )}
            </span>
            <Nav.Link
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
            >
              {theme === "light" ? (
                <MdLightMode size={24} />
              ) : (
                <FiMoon size={24} />
              )}
            </Nav.Link>
            {!sessionData ? (
              <Link
                href="./signin"
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

export default Navbars;
