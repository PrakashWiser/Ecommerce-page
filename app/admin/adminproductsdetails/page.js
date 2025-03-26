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

// Custom CSS for responsiveness
const styles = `
  .product-container {
    padding: 1rem;
  }
  .product-card {
    padding: 1rem;
    overflow-x: auto;
  }
  .product-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }
  .product-search {
    width: 100%;
  }
  .product-table {
    width: 100%;
    min-width: 600px; /* Ensures table doesn't shrink too much */
  }
  .product-table th, 
  .product-table td {
    padding: 0.75rem;
    vertical-align: middle;
  }
  .product-image-container {
    width: 50px;
    height: 50px;
    min-width: 50px;
  }
  .product-image {
    border-radius: 4px;
    object-fit: cover;
  }
  .action-buttons {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
  }
  .empty-state img {
    max-width: 100%;
    height: auto;
  }
  .product-name {
    word-break: break-word;
  }
  
  @media (min-width: 768px) {
    .product-container {
      padding: 2rem;
    }
    .product-card {
      padding: 2rem;
    }
    .product-header {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
    .product-search {
      width: auto;
    }
    .product-table {
      min-width: auto;
    }
  }
`;

const Product = () => {
  const router = useRouter();
  const [APIData, setAPIData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
    console.log("Admin Cookie in Product:", adminSession);

    if (adminSession) {
      setIsAuthenticated(true);
      getData();
    } else {
      setIsAuthenticated(false);
      if (router.pathname !== "/user/signin") {
        showToast("Please login to access this page", "error");
        setTimeout(() => {
          router.push("/user/signin");
        }, 2000);
      }
    }
  }, [getData, router.pathname]);

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

  if (isLoading || !isAuthenticated) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <Container className="product-container">
        <Card className="border-0 shadow-sm product-card">
          <Card.Body>
            <div className="product-header">
              <div className="mb-3 mb-md-0">
                <h2 className="h4 mb-1">Product Management</h2>
                <p className="text-muted mb-0">
                  {APIData.length} products available
                </p>
              </div>
              <div className="d-flex flex-column flex-md-row gap-3 w-100 product-search">
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
                    className="d-flex align-items-center justify-content-center gap-2 px-3 text-white w-100"
                  >
                    <FiPlus size={16} /> 
                    <span className="d-none d-md-inline">Add Product</span>
                  </Button>
                </Link>
              </div>
            </div>
            
            {filteredProducts.length > 0 ? (
              <div className="table-responsive">
                <Table hover className="product-table mb-0">
                  <thead>
                    <tr className="bg-light">
                      <th>#</th>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th className="text-end">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((data, index) => (
                      <tr key={data.id}>
                        <td className="fw-semibold">{index + 1}</td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="product-image-container">
                              <Image
                                src={`https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/${data.image}`}
                                alt={data.name}
                                width={50}
                                height={50}
                                className="product-image border"
                                priority={index < 3}
                              />
                            </div>
                            <div className="product-name">
                              <div className="fw-semibold">{data.name}</div>
                              <small className="text-muted">SKU: {data.id}</small>
                            </div>
                          </div>
                        </td>
                        <td className="fw-semibold">₹{data.price}</td>
                        <td>
                          <Badge bg="light" text="dark" className="text-capitalize">
                            {data.listingType}
                          </Badge>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleUpdate(data.id)}
                              aria-label="Edit"
                            >
                              <FiEdit2 size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(data.id)}
                              aria-label="Delete"
                            >
                              <FiTrash2 size={14} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-5 empty-state">
                <Image
                  src={Empty}
                  alt="No products"
                  width={300}
                  height={300}
                  className="img-fluid mb-4"
                  priority
                />
                <h5 className="h5 mb-2">No products found</h5>
                <p className="text-muted mb-4">
                  {searchTerm
                    ? "Try a different search term"
                    : "Get started by adding your first product"}
                </p>
                <Link href="/admin/addproducts" passHref legacyBehavior>
                  <Button
                    variant="primary"
                    className="d-inline-flex align-items-center gap-2"
                  >
                    <FiPlus size={16} /> Add Product
                  </Button>
                </Link>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </>
  );
};

export default Product;