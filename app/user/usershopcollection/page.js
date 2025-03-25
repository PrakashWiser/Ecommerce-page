"use client"
import React, { useState, useEffect } from "react";
import MainLayout from "@/app/Layout/MainLayout";
import { Container, Row, Col, Button, Card, Spinner, Modal } from "react-bootstrap";
import Navbars from "../components/Navbars";
import { MdDelete } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";
import { showToast } from "@/app/user/components/ToastMessage";
import Image from "next/image";
import Emptys from "@/app/assets/images/direct_empty_cart.webp";
import { FaMinus, FaPlus } from "react-icons/fa";
import Link from "next/link";
import Cookies from "js-cookie";

const Giturl = "https://raw.githubusercontent.com/prakashwiser/Ecommerce-page/refs/heads/main/app/assets/images/";

function ShopCollection() {
  // ... [rest of your component logic remains the same until the return statement]

  return (
    <MainLayout>
      <Navbars />
      <Container className="my-4 min-vh-100">
        {collection.length > 0 ? (
          <>
            {/* ... [rest of your JSX remains the same until the empty cart section] */}
          </>
        ) : (
          <div className="text-center py-5">
            <Image
              src={Emptys}
              alt="Empty cart"
              width={300}
              height={300}
              className="img-fluid mb-4"
              priority
            />
            <h3 className="mb-3">Your cart is empty</h3>
            <p className="text-muted mb-4">
              Looks like you haven&apos;t added anything to your cart yet
            </p>
            <Button variant="primary" className="text-white" href="/" as={Link}>
              Continue Shopping
            </Button>
          </div>
        )}

        <Modal
          show={showOrderModal}
          onHide={() => setShowOrderModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Order Confirmation</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p className="fw-bold mb-3">Your order has been placed successfully!</p>
            <div className="mb-3">
              <p>Order Summary:</p>
              <ul className="list-unstyled">
                <li>Total Items: {collection.length}</li>
                <li>Order Total: ₹{getTotalPrice().toFixed(2)}</li>
                <li>Estimated Delivery: 3-5 business days</li>
              </ul>
            </div>
            <p>Thank you for your purchase!</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={confirmOrder}>
              Continue Shopping
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </MainLayout>
  );
}

export default ShopCollection;