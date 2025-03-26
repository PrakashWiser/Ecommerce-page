"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import homebBanner from "./assets/images/home-banner.webp";
import { TbSkateboard } from "react-icons/tb";
import { GiConverseShoe, GiHeadphones } from "react-icons/gi";
import { FaArrowRight, FaGithub } from "react-icons/fa";
import { PiShoppingCart, PiTShirtDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Navbars from "./user/components/Navbars";
import Loader from "./user/components/Loader";
import Embty from "../app/assets/images/embty-data.webp";
import { useGlobalContext } from "./api/providers/GlobalContext";
import { motion } from "framer-motion";

export default function Home() {
  const [APIData, setAPIData] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [value, setValue] = useState("all");
  const router = useRouter();
  const { data, loading } = useGlobalContext();

  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  useEffect(() => {
    if (data && data.length > 0) {
      setAPIData(data);
    }
  }, [data]);

  const filteredData = useMemo(() => {
    if (value === "all") return APIData;
    return APIData.filter((item) => item.listingType === value);
  }, [value, APIData]);

  const getCategoryCount = (categoryValue) => {
    return APIData.filter((item) => item.listingType === categoryValue).length;
  };

  const handleViewAll = () => {
    setShowAllProducts(true);
  };

  const handleProductClick = (id) => {
    router.push(`/user/userproductsdetails/${id}`);
  };

  const displayedProducts = showAllProducts
    ? filteredData
    : filteredData.slice(0, 8);

  if (loading) {
    return <Loader />;
  }

  const CategoryCard = ({ icon, title, count, onClick }) => (
    <Col xs={6} md={3}>
      <div
        className="shadow p-4 rounded text-center cursor-pointer"
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        <div className="mb-3">{icon}</div>
        <h4>{title}</h4>
        <span>{count} Products</span>
      </div>
    </Col>
  );

  const categories = [
    {
      icon: <TbSkateboard size={24} />,
      title: "Skateboards",
      value: "sketeboard",
      count: getCategoryCount("sketeboard"),
    },
    {
      icon: <PiTShirtDuotone size={24} />,
      title: "Clothing",
      value: "clothing",
      count: getCategoryCount("clothing"),
    },
    {
      icon: <GiConverseShoe size={24} />,
      title: "Shoe",
      value: "shoe",
      count: getCategoryCount("shoe"),
    },
    {
      icon: <GiHeadphones size={24} />,
      title: "Mobile",
      value: "mobile",
      count: getCategoryCount("mobile"),
    },
  ];

  return (
    <>
      <section>
        <Navbars />
        <div className="home_sec_one mb-5 position-relative">
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
              <Row className="align-items-center">
                <Col md={7}>
                  <Link
                    href="https://github.com/prakashwiser/Ecommerce-page"
                    className="bg-white fw600 p-1 rounded px-2 text_black d-inline-flex align-items-center"
                  >
                    <FaGithub />
                    <span className="ps-2">Start on Github</span>
                  </Link>
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
                      href="/usershopcollection"
                    >
                      Buy Now
                    </Link>
                    <Link
                      className="rounded-pill fw600 py-2 px-3 border border-gray"
                      href="#"
                    >
                      Sell Now
                    </Link>
                  </div>
                </Col>
                <Col md={5}>
                  <Image
                    src={homebBanner}
                    alt="home-banner-img"
                    className="img-fluid rounded-pill my-4 my-md-0"
                    width={500}
                    height={300}
                  />
                </Col>
              </Row>
            </Container>
          </div>
        </div>
      </section>

      <section>
        <div className="home_sec_two">
          <Container>
            <h2 className="primary_color">Featured Categories</h2>
            <ul className="d-lg-flex justify-content-between">
              <li>
                <p>
                  Find the best skateboarding gears from stores around the world
                </p>
              </li>
              <li>
                <Link href="/usershopcollection" className="primary_color">
                  Shop the Collection <FaArrowRight className="svg_frist" />
                </Link>
              </li>
            </ul>
            <Row>
              {categories.map((category, index) => (
                <CategoryCard
                  key={index}
                  icon={category.icon}
                  title={category.title}
                  count={category.count}
                  onClick={() => setValue(category.value)}
                />
              ))}
            </Row>
          </Container>
        </div>
      </section>

      <section>
        <Container>
          <div className="home_sec_three my-5">
            <h2 className="primary_color">
              Popular Products <span>({filteredData.length})</span>
            </h2>
            <ul className="d-lg-flex justify-content-between">
              <li>
                <p>Explore all products we offer from around the world</p>
              </li>
              <li>
                <Link href="/usershopcollection" className="primary_color">
                  Shop the Collection <FaArrowRight className="svg_frist" />
                </Link>
              </li>
            </ul>
            {displayedProducts.length > 0 ? (
              <Row>
                {displayedProducts.map((item) => (
                  <Col md={6} lg={3} key={item.id} className="mb-4 d-flex">
                    <motion.div
                      className="w-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card
                        className="shadow h-100"
                        onClick={() => handleProductClick(item.id)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          cursor: "pointer",
                        }}
                      >
                        <div style={{ height: "200px", overflow: "hidden" }}>
                          <Card.Img
                            variant="top"
                            src={Giturl + item.image}
                            alt={item.name}
                            className="img_details w-100 h-100"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="flex-grow-0">
                            {item.name}
                          </Card.Title>
                          <Card.Text
                            className="flex-grow-1"
                            style={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {item.discription || ""}
                          </Card.Text>
                          <Card.Footer className="border-0 bg-white d-flex justify-content-between align-items-center p-0 pt-2">
                            <small className="text-muted">${item.price}</small>
                            <motion.button
                              className="border-0 bg-transparent p-0"
                              whileHover={{ scale: 1.2 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <PiShoppingCart size={20} />
                            </motion.button>
                          </Card.Footer>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                ))}
              </Row>
            ) : (
              <motion.div
                className="text-center w-100"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={Embty}
                  alt="No Data"
                  width={300}
                  height={200}
                  style={{ margin: "20px auto" }}
                />
                <p>No products available</p>
              </motion.div>
            )}
            {!showAllProducts && filteredData.length > 8 && (
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
