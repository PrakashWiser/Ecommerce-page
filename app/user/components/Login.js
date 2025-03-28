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
  const isLoginPage = pathname === "/signin";

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
      // Clear existing cookies
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

      // Set secure cookie with proper options
      Cookies.set(cookieName, JSON.stringify(userData), {
        expires: 1, // 1 day
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      });

      showToast("Successfully logged in!", "success");

      if (onLoginSuccess) {
        onLoginSuccess(userData);
      } else {
        let redirectPath;

        // 1. Admin always goes to admin dashboard
        if (isAdmin) {
          redirectPath = "/admin/adminproductsdetails";
        }
        // 2. If coming from collection page, go back there
        else if (fromCollectionPage) {
          redirectPath = "/user/usershopcollection";
        }
        // 3. If on login page, go to home
        else if (isLoginPage) {
          redirectPath = "/";
        }
        // 4. Default: Stay on current page or go home
        else {
          redirectPath = pathname || "/";
        }

        router.push(redirectPath);
        router.refresh();

        // Additional actions after login
        if (typeof window !== "undefined") {
          localStorage.setItem("userSession", JSON.stringify(userData));
          window.dispatchEvent(new Event("userLoggedIn"));
        }
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
        className="d-flex justify-content-center align-items-center"
        style={{ height: isLoginPage || compact ? "auto" : "100vh" }}
      >
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isLoginPage
          ? "min-vh-100 d-flex flex-column justify-content-center align-items-center bg-light"
          : compact
          ? "p-3"
          : "d-flex flex-column justify-content-center align-items-center"
      }
    >
      <style jsx>{`
        .login-form {
          width: 100%;
          max-width: ${isLoginPage ? "400px" : "100%"};
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: ${isLoginPage ? "0 4px 6px rgba(0, 0, 0, 0.05)" : "none"};
          background: white;
        }
      `}</style>

      {(!compact || isLoginPage) && (
        <div className="text-center mb-4">
          <a
            href="https://github.com/prakashwiser/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="d-inline-block mb-3"
          >
            <ImGithub className="fs-2" />
          </a>
          <h1 className="fw-bold mb-2">Welcome back</h1>
          <p className="text-muted">Sign in to continue to your account</p>
        </div>
      )}

      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="login-form">
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
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
              <label htmlFor="password" className="form-label">
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

            <div className="d-grid gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-success"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : null}
                Sign In
              </button>

              {(!compact || isLoginPage) && (
                <>
                  {!fromCollectionPage && (
                    <Link
                      href="/user/signupp"
                      className="btn btn-outline-primary"
                    >
                      Create Account
                    </Link>
                  )}
                  <div className="text-center mt-2">
                    <Link href="/user/forgot" className="text-muted small">
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
  );
};

export default Login;
