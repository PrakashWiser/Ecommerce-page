"use client";
import React, { useEffect, useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { showToast } from "@/app/user/components/ToastMessage";
import "bootstrap/dist/css/bootstrap.min.css";

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiData, setApiData] = useState([]);
  const navigate = useRouter();

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email address")
      .required("Email is required"),
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://66f0f85341537919154f06e7.mockapi.io/signup"
        );
        setApiData(response.data);
      } catch (error) {
        showToast("Failed to fetch user data", "error");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);
  const Time = new Date();
  const years = Time.getFullYear();

  const handleSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const user = apiData.find((user) => user.email === values.email);

      if (!user) {
        showToast("No account found with this email", "error");
        return;
      }

      await emailjs.send(
        "service_2cer1wn",
        "template_prcyhjn",
        {
          companyName: "PrakashTech",
          email: user.email,
          password: user.password,
          name: user.name || "User",
          loginLink: "https://ecommerce-page-opal.vercel.app/user/signin",
          year: years,
        },
        "U0vN6ww9BrU7Y_JSF"
      );

      showToast("Password recovery email sent successfully!", "success");
      resetForm();
      setInterval(() => {
        navigate.push("/user/signin"); 
      }, 1500);
    } catch (error) {
      console.error("Email error:", error);
      showToast(
        error.text?.includes("insufficient authentication scopes")
          ? "Email service configuration error"
          : "Failed to send email. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light p-4">
      <div
        className="card border-0 shadow-sm w-100"
        style={{ maxWidth: "450px" }}
      >
        <div className="card-header bg-gradient bg-success text-white text-center py-4">
          <h2 className="mb-1 fw-bold">
            <i className="bi bi-key me-2"></i>
            Password Recovery
          </h2>
          <p className="mb-0 opacity-75">
            Enter your email to receive reset instructions
          </p>
        </div>

        <div className="card-body p-4 p-md-5">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ touched, errors, handleSubmit, isSubmitting }) => (
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="email" className="form-label fw-semibold">
                    Email Address
                  </label>
                  <Field
                    name="email"
                    type="email"
                    className={`form-control form-control-lg ${
                      touched.email && errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="invalid-feedback mt-2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || isSubmitting}
                  className="btn btn-success btn-lg w-100 py-3 fw-bold"
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-envelope-check me-2"></i>
                      Send Recovery Email
                    </>
                  )}
                </button>
              </form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p className="text-muted mb-0">
              Remember your password?{" "}
              <button
                onClick={() => navigate("/user/login")}
                className="btn btn-link text-decoration-none p-0 fw-semibold"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
