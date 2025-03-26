"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Table,
  Button,
  Container,
  Spinner,
  Card,
  Badge,
  InputGroup,
  Form,
} from "react-bootstrap";
import { showToast } from "@/app/user/components/ToastMessage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import Empty from "@/app/assets/images/no-found.jpg";
const Product = () => {
  const router = useRouter();
  const [APIData, setAPIData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getData = useCallback(async () => {
    try {
      const response = await axios.get(
        "https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products"
      );
      setAPIData(response.data);
    } catch (error) {
      showToast("Failed to fetch products", "error");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const adminSession = Cookies.get("Admin");
    if (!adminSession) {
      showToast("Please login to access this page", "error");
      setTimeout(() => {
        router.push("/user/signin");
      }, 2000);
      return;
    }
    getData();
  }, [getData, router]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      await axios.delete(
        `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products/${id}`
      );
      showToast("Product deleted successfully", "success");
      getData();
    } catch (error) {
      showToast("Failed to delete product", "error");
      console.error("Error deleting product:", error);
    }
  };

  const handleUpdate = (id) => {
    router.push(`/admin/adminproductsupdate/${id}`);
  };

  const filteredProducts = APIData.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.listingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <div className="mb-3 mb-md-0">
              <h2 className="mb-1">Product Management</h2>
              <p className="text-muted mb-0">
                {APIData.length} products available
              </p>
            </div>
            <div className="d-flex flex-column flex-md-row gap-3 w-50 w-md-auto">
              <InputGroup className="mb-2 mb-md-0">
                <InputGroup.Text>
                  <FiSearch />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
              <Link href="/admin/addproducts" passHref legacyBehavior>
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-2 px-3 text-white"
                >
                  <FiPlus /> Add Product
                </Button>
              </Link>
            </div>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead>
                  <tr className="bg-light">
                    <th style={{ width: "5%" }}>#</th>
                    <th style={{ width: "25%" }}>Product</th>
                    <th style={{ width: "10%" }}>Price</th>
                    <th style={{ width: "15%" }}>Category</th>
                    <th style={{ width: "15%" }} className="text-end">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((data, index) => (
                    <tr key={data.id}>
                      <td className="fw-semibold">{index + 1}</td>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div
                            style={{ width: "60px", height: "60px" }}
                            className="flex-shrink-0"
                          >
                            <Image
                              src={`https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/${data.image}`}
                              alt={data.name}
                              width={60}
                              height={60}
                              className="rounded border"
                              style={{ objectFit: "cover" }}
                              priority={index < 3}
                            />
                          </div>
                          <div>
                            <div className="fw-semibold">{data.name}</div>
                            <small className="text-muted">SKU: {data.id}</small>
                          </div>
                        </div>
                      </td>
                      <td className="fw-semibold">₹{data.price}</td>
                      <td>
                        <Badge
                          bg="light"
                          text="dark"
                          className="text-capitalize"
                        >
                          {data.listingType}
                        </Badge>
                      </td>
                      <td className="text-end">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => handleUpdate(data.id)}
                        >
                          <FiEdit2 />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(data.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <Image
                src={Empty}
                alt="No products"
                width={500}
                height={500}
                className="img-fluid mb-4"
              />
              <h5 className="mb-2">No products found</h5>
              <p className="text-muted mb-4">
                {searchTerm
                  ? "Try a different search term"
                  : "Get started by adding your first product"}
              </p>
              <Link href="/admin/addproducts" passHref legacyBehavior>
                <Button
                  variant="primary"
                  className="d-flex align-items-center gap-2 mx-auto"
                >
                  <FiPlus /> Add Product
                </Button>
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Product;
