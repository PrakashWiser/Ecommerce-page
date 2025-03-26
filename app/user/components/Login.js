"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImGithub } from "react-icons/im";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { showToast } from "@/app/user/components/ToastMessage";
import { useDispatch } from "react-redux";
import { cartActions } from "@/app/api/redux/cartSlice";

const Login = () => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://66f0f85341537919154f06e7.mockapi.io/signup"
        );
        setApiData(response.data);
        console.log("API Data:", response.data); // Log to verify data
      } catch (error) {
        showToast("Failed to fetch user data", "error");
        console.error("Error fetching user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    const { email, password } = values;

    try {
      console.log("Submitting with:", { email, password }); 
      const user = apiData.find((item) => item.email === email);

      if (!user) {
        showToast("Can't find your email, please register first", "error");
        return;
      }

      if (user.password !== password) {
        showToast("Incorrect password, please try again", "warning");
        return;
      }

      dispatch(cartActions.initializeCart({ email: user.email }));
      const isAdmin = user.email === "prakashlunatic2@gmail.com";
      const cookieName = isAdmin ? "Admin" : "Data";
      const redirectPath = isAdmin ? "/admin/adminproductsdetails" : "/";

      Cookies.set(
        cookieName,
        JSON.stringify({
          email: user.email,
          name: user.name || "",
        }),
        {
          expires: 7,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        }
      );

      showToast("Successfully Logged In", "success");
      router.push(redirectPath);
    } catch (error) {
      console.error("Detailed login error:", {
        message: error.message,
        stack: error.stack,
        cause: error.cause,
      });
      showToast(`Login failed: ${error.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center mb-4">
        <a
          href="https://github.com/prakashwiser/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View GitHub profile"
          className="d-inline-block mb-3"
        >
          <ImGithub className="fs-2 text-dark" />
        </a>
        <h1 className="fw-bold text-success mb-3">Sign in</h1>
        <p className="text-muted">Welcome back! Please enter your details</p>
      </div>

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form
            className="w-100 bg-white p-4 rounded-3 shadow-sm"
            style={{ maxWidth: "400px" }}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label fw-semibold">
                Email address
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className={`form-control ${
                  touched.email && errors.email ? "is-invalid" : ""
                }`}
                placeholder="Enter your email"
                autoComplete="username"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label fw-semibold">
                Password
              </label>
              <Field
                type="password"
                name="password"
                id="password"
                className={`form-control ${
                  touched.password && errors.password ? "is-invalid" : ""
                }`}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="invalid-feedback"
              />
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                type="submit"
                className="btn btn-success fw-bold px-4 py-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                Sign in
              </button>

              <Link
                href="/user/signupp"
                className="btn btn-outline-primary fw-bold px-4 py-2"
              >
                Create Account
              </Link>
            </div>

            <div className="text-center mt-3">
              <Link
                href="/user/forgot-password"
                className="text-decoration-none"
              >
                Forgot password?
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
