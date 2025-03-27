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

const styles = `
  .login-container {
    padding: 1rem;
    min-height: 100vh;
  }
  .login-form {
    width: 100%;
    max-width: 400px;
    padding: 1.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  }
  .login-title {
    font-size: 1.75rem;
    font-weight: 700;
  }
  .login-subtitle {
    font-size: 0.95rem;
    color: #6b7280;
  }
  .form-control {
    padding: 0.75rem;
    border-radius: 8px;
  }
  .btn {
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s ease;
  }
  .btn-success {
    background-color: #10b981;
    border-color: #10b981;
  }
  .btn-success:hover {
    background-color: #0da271;
    border-color: #0da271;
  }
  .github-icon {
    font-size: 1.75rem;
    color: #1f2937;
    transition: transform 0.2s ease;
  }
  .github-icon:hover {
    transform: scale(1.1);
  }
  .form-label {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  .invalid-feedback {
    font-size: 0.85rem;
  }
  .forgot-password {
    font-size: 0.9rem;
    color: #6b7280;
    transition: color 0.2s ease;
  }
  .forgot-password:hover {
    color: #374151;
    text-decoration: none;
  }

  @media (min-width: 768px) {
    .login-container {
      padding: 2rem;
    }
    .login-title {
      font-size: 2rem;
    }
    .login-subtitle {
      font-size: 1rem;
    }
    .btn-group {
      flex-direction: row;
      gap: 1rem;
    }
  }

  @media (max-width: 576px) {
    .login-form {
      padding: 1.25rem;
    }
    .btn-group {
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn {
      width: 100%;
    }
  }
`;

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

  const handleSubmit = (values, { setSubmitting }) => {
    const { email, password } = values;

    try {
      Cookies.remove("Admin");
      Cookies.remove("Data");

      const user = apiData.find((item) => item.email === email);

      if (!user) {
        showToast("Email not found. Please register first.", "error");
        return;
      }

      if (user.password !== password) {
        showToast("Incorrect password. Please try again.", "warning");
        return;
      }

      dispatch(cartActions.initializeCart({ email: user.email }));

      const isAdmin = user.email === "prakashlunatic2@gmail.com";
      const cookieName = isAdmin ? "Admin" : "Data";

      Cookies.set(
        cookieName,
        JSON.stringify({
          email: user.email,
          name: user.name || "",
        }),
        {
          expires: 1,
          sameSite: "strict",
          path: "/",
        }
      );

      showToast("Successfully logged in!", "success");

      const redirectPath = isAdmin ? "/admin/adminproductsdetails" : "/";
      router.push(redirectPath);
      router.refresh(); 
    } catch (error) {
      console.error("Login error:", error.message);
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
    <>
      <style>{styles}</style>
      <div className="login-container d-flex flex-column justify-content-center align-items-center">
        <div className="text-center mb-4">
          <a
            href="https://github.com/prakashwiser/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="d-inline-block mb-3"
          >
            <ImGithub className="github-icon" />
          </a>
          <h1 className="login-title mb-2">Welcome back</h1>
          <p className="login-subtitle">Sign in to continue to your account</p>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className="login-form bg-white">
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

              <div className="d-flex justify-content-between align-items-center mt-4 btn-group">
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

                <Link href="/user/signupp" className="btn btn-outline-primary">
                  Create Account
                </Link>
              </div>

              <div className="text-center mt-3">
                <Link href="/user/forgot-password" className="forgot-password">
                  Forgot password?
                </Link>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default Login;
