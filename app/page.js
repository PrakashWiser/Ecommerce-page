"use client";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import homebBanner from "./assets/images/home-banner.webp";
import { TbSkateboard } from "react-icons/tb";
import { GiConverseShoe, GiHeadphones } from "react-icons/gi";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { PiShoppingCart, PiTShirtDuotone } from "react-icons/pi";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "./components/Image";
import Navbars from "./components/Navbars";
export default function Home() {
  const [APIData, setAPIData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [value, setValue] = useState("all");
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
  }, []);

  useEffect(() => {
    if (value === "all") {
      setFilteredData(APIData);
    } else {
      const filtered = APIData.filter((item) => item.listingType === value);
      setFilteredData(filtered);
    }
  }, [value, APIData]);

  const handleViewAll = () => {
    setShowAllProducts(true);
  };

  const displayedProducts = showAllProducts
    ? filteredData
    : filteredData.slice(0, 8);

  const handleclcik = (id) => {
    router.push(`/user/${id}`);
  };
  let LengthData = filteredData.length;
  return (
    <>
      <section>
        <Navbars />
        <div className="home_sec_one mb-5 postion-relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="position_tybe"
          >
            <path
              fill="#10b981"
              fillOpacity="1"
              d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,122.7C672,96,768,96,864,122.7C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
          <div className="ecommerce">
            <Container>
              <Row className=" align-items-center">
                <Col md={7}>
                  <span className=" bg-white  fw600 p-1 rounded px-2 text_black">
                    <span>
                      <FaGithub />
                    </span>
                    <span className="ps-2 ">Start on Github</span>
                  </span>
                  <h1>
                    An open source e-commerce project built by{" "}
                    <span>inifarhan</span>
                  </h1>
                  <p>
                    Buy and sell skateboarding gears from independent brands and
                    stores around the world with ease
                  </p>
                  <div className="d-flex gap-3">
                    <Link
                      className="rounded-pill fw600 bg_green py-2 px-3 text-white"
                      href="/shopcollection"
                    >
                      Buy Now
                    </Link>
                    <Link
                      className="rounded-pill fw600  py-2 px-3 border boder-gray"
                      href="#"
                    >
                      Sell Now
                    </Link>
                  </div>
                </Col>
                <Col md={5}>
                  <Image
                    link={homebBanner}
                    styles="img-fluid rounded-pill my-4 my-md-0"
                    alt="home-banner-img"
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </section>
      <section>
        <div className="home_sec_two ">
          <Container>
            <h2 className="primary_color">Featured Categories</h2>
            <ul className="d-lg-flex justify-content-between ">
              <li>
                <p>
                  Find the best skateboarding gears from stores around the world
                </p>
              </li>
              <li>
                <Link href="/shopcollection" className="primary_color">
                  Shop the Collection <FaArrowRight className="svg_frist" />
                </Link>
              </li>
            </ul>
            <Row>
              <Col xs={6} md={3}>
                <div
                  className="shadow p-4 rounded"
                  onClick={() => setValue("sketeboard")}
                >
                  <TbSkateboard />
                  <h4>Skateboards</h4>
                  <span>4 products</span>
                </div>
              </Col>
              <Col xs={6} md={3}>
                <div
                  className="shadow p-4 rounded"
                  onClick={() => setValue("clothing")}
                >
                  <PiTShirtDuotone />
                  <h4>Clothing</h4>
                  <span>9 products</span>
                </div>
              </Col>{" "}
              <Col xs={6} md={3}>
                <div
                  className="shadow p-4 rounded"
                  onClick={() => setValue("shoe")}
                >
                  <GiConverseShoe />
                  <h4>Shoe</h4>
                  <span>8 products</span>
                </div>
              </Col>{" "}
              <Col xs={6} md={3}>
                <div
                  className="shadow p-4 rounded"
                  onClick={() => setValue("mobile")}
                >
                  <GiHeadphones />
                  <h4>mobile</h4>
                  <span> 11 products</span>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </section>
      <section>
        <Container>
          <div className="home_sec_three my-5">
            <h2 className="primary_color">
              Popular Products <span>({LengthData})</span>
            </h2>
            <ul className="d-lg-flex justify-content-between ">
              <li>
                <p>Explore all products we offer from around the world</p>
              </li>
              <li>
                <Link href="/shopcollection" className="primary_color">
                  Shop the Collection <FaArrowRight className="svg_frist" />
                </Link>
              </li>
            </ul>
            <div>
              <Row>
                {displayedProducts.map((items, index) => (
                  <Col md={6} lg={3} key={index} className="mb-3">
                    <Card
                      className="shadow"
                      onClick={() => handleclcik(items.id)}
                      style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        transition: "box-shadow 0.3s ease",
                      }}
                    >
                      <Card.Img
                        variant="top"
                        src={Giturl + items.image}
                        alt={items.name}
                        className="img_details"
                      />
                      <Card.Body style={{ flexGrow: 1 }}>
                        <Card.Title>{items.name}</Card.Title>
                        <Card.Text
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                          }}
                        >
                          {items.discription ? items.discription : ""}
                        </Card.Text>
                      </Card.Body>
                      <Card.Footer
                        className="border-0 d-flex justify-content-between align-items-center"
                        style={{ backgroundColor: "#fff" }}
                      >
                        <small className="text-muted">{items.price}</small>
                        <small>
                          <PiShoppingCart />
                        </small>
                      </Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
            {!showAllProducts && (
              <div className="d-flex justify-content-center mt-4">
                <button
                  className="rounded-pill bg_green py-2 px-3 text-white border-0"
                  onClick={handleViewAll}
                >
                  View all products
                  <FaArrowRight className="ms-2" />
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
