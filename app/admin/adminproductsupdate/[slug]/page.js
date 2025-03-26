"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Container, Card, Spinner, Alert, Form, Button } from "react-bootstrap";
import Image from "next/image";
import { FiArrowLeft, FiSave, FiUpload } from "react-icons/fi";

const UpdatePro = ({ params }) => {
  const { slug: value } = params;
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    listingType: "others",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products/${value}`
        );
        const product = response.data;
        console.log(product);
        
        setFormData({
          name: product.name,
          price: product.price.replace(/[^0-9]/g, ""),
          description: product.description || product.discription || "",
          image: product.image,
          listingType: product.listingType || "others",
        });
      } catch (err) {
        setError("Failed to fetch product details");
        console.error("Error fetching product:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedProduct = {
        ...formData,
        discription: formData.description,
        image: imagePreview || formData.image,
      };

      await axios.put(
        `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products/${value}`,
        updatedProduct
      );

      showToast("Product updated successfully", "success");
      router.push("/admin/adminproductsdetails");
    } catch (err) {
      setError("Failed to update product");
      console.error("Error updating product:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const Giturl =
    "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => router.back()}>
          <FiArrowLeft className="me-2" />
          Go Back
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Button
        variant="outline-secondary"
        onClick={() => router.back()}
        className="mb-4"
      >
        <FiArrowLeft className="me-2" />
        Back to Products
      </Button>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <h2 className="mb-4">Update Product</h2>

          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label>Product Image</Form.Label>
                  <div className="d-flex flex-column gap-3">
                    <div className="border rounded p-3 text-center">
                      {imagePreview ? (
                        <Image
                          src={imagePreview}
                          alt="New Preview"
                          width={300}
                          height={200}
                          className="img-fluid rounded"
                          style={{ objectFit: "contain", maxHeight: "200px" }}
                        />
                      ) : formData.image ? (
                        <Image
                          src={`${Giturl}${formData.image}`}
                          alt="Current Product"
                          width={300}
                          height={200}
                          className="img-fluid rounded"
                          style={{ objectFit: "contain", maxHeight: "200px" }}
                        />
                      ) : (
                        <div className="py-5 text-muted">No image selected</div>
                      )}
                    </div>
                    <div>
                      <Form.Label
                        htmlFor="image-upload"
                        className="btn btn-outline-primary w-100 d-flex align-items-center justify-content-center gap-2"
                      >
                        <FiUpload /> Upload New Image
                      </Form.Label>
                      <Form.Control
                        type="file"
                        id="image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="d-none"
                      />
                    </div>
                  </div>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="listingType"
                    value={formData.listingType}
                    onChange={handleChange}
                    required
                  >
                    <option value="sketeboard">Skateboard</option>
                    <option value="clothing">Clothing</option>
                    <option value="shoe">Shoe</option>
                    <option value="headphone">Headphone</option>
                    <option value="mobile">Mobile</option>
                    <option value="others">Others</option>
                  </Form.Select>
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-4">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={5}
                value={formData.description}
                onChange={handleChange}
                style={{ resize: "none" }}
              />
            </Form.Group>

            <div className="d-flex justify-content-end gap-3">
              <Button variant="outline-secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
                className="d-flex align-items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <FiSave /> Update Product
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UpdatePro;