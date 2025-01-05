"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import { Table, Button, Container } from "react-bootstrap";
import { useRouter } from "next/navigation";

const Product = () => {
  const router = useRouter();
  const [APIData, setAPIData] = useState([]);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const adminSession = sessionStorage.getItem("Admin");
    setAdmin(adminSession);

    axios
      .get(`https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`)
      .then((response) => {
        setAPIData(response.data);
      });
  }, []);

  const getData = () => {
    axios
      .get(`https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products`)
      .then((getData) => {
        setAPIData(getData.data);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(
        `https://67446e69b4e2e04abea22dd9.mockapi.io/wiser-products/${id}`
      )
      .then(() => {
        getData();
      });
  };

  const handleUpdate = (id) => {
    router.push(`/adminproductsupdate/${id}`);
  };

  if (admin === null) {
    return <div className="text-center">Loading....</div>;
  }

  return (
    <>
      {admin ? (
        <Container className="mt-4">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "grey",
              padding: "10px",
            }}
          >
            <h5 className="text-white">Product Details Page</h5>
            <Link href="/addproducts" passHref>
              <Button variant="success">Add New Products</Button>
            </Link>
          </div>
          {APIData.length !== 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead className="table-dark">
                  <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Image</th>
                    <th>Category</th>
                    <th>Delete</th>
                    <th>Update</th>
                  </tr>
                </thead>
                <tbody>
                  {APIData.map((data, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.price}</td>
                      <td>
                        <img
                          style={{ width: "60px" }}
                          src={
                            "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/" +
                            data.image
                          }
                          alt="Product"
                        />
                      </td>
                      <td className="text-capitalize">{data.listingType}</td>
                      <td>
                        <Button
                          variant="danger"
                          onClick={() => handleDelete(data.id)}
                        >
                          Delete
                        </Button>
                      </td>
                      <td>
                        <Button
                          variant="warning text-white"
                          onClick={() => handleUpdate(data.id)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p className="text-center text-muted">No data available</p>
          )}
        </Container>
      ) : (
        router.push("/signin")
      )}
    </>
  );
};

export default Product;
