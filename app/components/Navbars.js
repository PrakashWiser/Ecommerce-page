"use client";
import { useState, useEffect, memo } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { Button } from "react-bootstrap";
import Searchbar from "./Searchbar";
import { FiShoppingCart } from "react-icons/fi";
import { TbSkateboard } from "react-icons/tb";
import { MdLightMode } from "react-icons/md";
import { FiMoon } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";

const DropdownContent = memo(({ items }) => {
  return (
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
  );
});

DropdownContent.displayName = "DropdownContent";

function Navbars() {
  const router = useRouter();
  const [theme, setTheme] = useState("light");
  const [sessionData, setSessionData] = useState(null);
  const [quantity, setQuantity] = useState([]);
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      setTheme(storedTheme);
      document.body.classList.toggle("dark-mode", storedTheme === "dark");
    }
    const collection1 = localStorage.getItem("cartItems");
    if (collection1) {
      setQuantity(JSON.parse(collection1));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.classList.toggle("dark-mode", theme === "dark");
    const session = localStorage.getItem("Data");
    setSessionData(session);
  }, [theme]);

  useEffect(() => {}, []);

  const handleLogout = () => {
    localStorage.clear();
    setSessionData(null);
    window.location.href = "/";
  };

  const dropdownItems = [
    [
      {
        href: "/",
        title: "Products",
        description: "All the products we have to offer",
      },
      {
        href: "#action4",
        title: "About Us",
        description: "Learn more about us",
      },
    ],
    [
      {
        href: "/productsdetails",
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
      <Container>
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
              Dasboard
            </Nav.Link>
          </Nav>
          <Form className="d-md-flex align-items-center gap-3">
            <Searchbar />
            <div className="position-relative">
              <FiShoppingCart
                aria-label="Shopping Cart"
                size={24}
                onClick={() => router.push("/shopcollection")}
              />
              {quantity.length > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-white left-10"
                  style={{ fontSize: "0.75rem", padding: "0.2em 0.6em" }}
                >
                  {quantity.length}
                </span>
              )}
            </div>
            <Nav.Link
              onClick={() =>
                setTheme((prev) => (prev === "light" ? "dark" : "light"))
              }
            >
              {theme === "light" ? <MdLightMode /> : <FiMoon />}
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
