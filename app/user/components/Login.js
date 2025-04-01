"use client";
import { ImGithub } from "react-icons/im";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Cookies from "js-cookie";
import { showToast } from "@/app/user/components/ToastMessage";

const Login = ({
  onLoginSuccess,
  compact = false,
  fromCollectionPage = false,
}) => {
  const [apiData, setApiData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/user/signin";

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
      Cookies.remove("Admin", { path: "/" });
      Cookies.remove("Data", { path: "/" });

      const user = apiData.find((item) => item.email === email);

      if (!user) {
        showToast("Email not found. Please register first.", "error");
        return;
      }

      if (user.password !== password) {
        showToast("Incorrect password. Please try again.", "warning");
        return;
      }

      const isAdmin = user.email === "prakashlunatic2@gmail.com";
      const cookieName = isAdmin ? "Admin" : "Data";
      const userData = {
        email: user.email,
        name: user.name || "",
        isAdmin,
        loggedInAt: new Date().toISOString(),
      };

      Cookies.set(cookieName, JSON.stringify(userData), {
        expires: 1,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      showToast("Successfully logged in!", "success");

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      } else {
        let redirectPath = "/";
        if (isAdmin) {
          redirectPath = "/admin/adminproductsdetails";
        } else if (!isLoginPage) {
          redirectPath = "/user/usershopcollection";
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(userData));
          window.dispatchEvent(new Event("userLoggedIn"));
        }

        router.push(redirectPath);
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast(`Login failed: ${error.message}`, "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`d-flex justify-content-center align-items-center ${
          isLoginPage ? "min-vh-100" : "py-5"
        }`}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${
        isLoginPage
          ? "min-vh-100 d-flex align-items-center justify-content-center bg-light"
          : compact
          ? "p-3"
          : "card shadow-sm"
      }`}
    >
      <div
        className={`${isLoginPage ? "card shadow-lg border-0" : "w-100"}`}
        style={{ maxWidth: "400px" }}
      >
        {(!compact || isLoginPage) && (
          <div className="card-header bg-white border-0 pt-4">
            <div className="text-center mb-3">
              <a
                href="https://github.com/prakashwiser/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                className="d-inline-flex align-items-center justify-content-center rounded-circle bg-light p-2"
              >
                <ImGithub className="fs-4 text-dark" />
              </a>
            </div>
            <h2 className="card-title text-center fw-bold mb-2">
              Welcome back
            </h2>
            <p className="text-muted text-center mb-0">
              Sign in to continue to your account
            </p>
          </div>
        )}

        <div className="card-body p-4">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, errors, touched }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field
                    type="email"
                    name="email"
                    id="email"
                    className={`form-control form-control-lg ${
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

                <div className="mb-4">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    type="password"
                    name="password"
                    id="password"
                    className={`form-control form-control-lg ${
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

                <div className="d-grid gap-3">
                  <button
                    type="submit"
                    className={`btn btn-success btn-lg ${
                      isSubmitting ? "disabled" : ""
                    }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing in...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>

                  {(!compact || isLoginPage) && (
                    <>
                      {!fromCollectionPage && (
                        <Link
                          href="/user/signupp"
                          className="btn btn-outline-primary btn-lg"
                        >
                          Create Account
                        </Link>
                      )}
                      <div className="text-center mt-2">
                        <Link
                          href="/user/forgot"
                          className="text-decoration-none text-muted small"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
