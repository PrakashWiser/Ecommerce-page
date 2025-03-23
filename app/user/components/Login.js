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

const Login = () => {
  const [apiData, setApiData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://66f0f85341537919154f06e7.mockapi.io/signup")
      .then((response) => {
        setApiData(response.data);
      })
      .catch(() => showToast("Failed to fetch user data", "error"));
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    const { email, password } = values;
    const user = apiData.find((item) => item.email === email);

    if (!user) {
      showToast("Can't find your email, please register first", "error");
      router.push("/signupp");
    } else if (user.password !== password) {
      showToast("Incorrect password, please try again", "warning");
    } else {
      const successMessage = "Successfully Logged In";
      const cookieName =
        user.email === "prakashlunatic2@gmail.com" ? "Admin" : "Data";
      const redirectPath =
        user.email === "prakashlunatic2@gmail.com"
          ? "/admin/adminproductsdetails"
          : "/";

      showToast(successMessage, "success");
      setTimeout(() => {
        Cookies.set(cookieName, user.email, { expires: 7 });
        router.push(redirectPath);
      }, 2000);
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <a
          href="https://github.com/prakashwiser/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ImGithub className="fs-2 text-dark mb-3" />
        </a>
        <h1 className="fw-bold text-success mb-4">Sign in</h1>
      </div>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="w-100" style={{ maxWidth: "400px" }}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <Field
                type="email"
                name="email"
                id="email"
                className="form-control shadow-sm"
                placeholder="Enter Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger mt-1"
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
                className="form-control shadow-sm"
                placeholder="Enter Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger mt-1"
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button
                type="submit"
                className="btn btn-success fw-bold shadow-sm px-4"
                disabled={isSubmitting}
              >
                Sign in
              </button>
              <Link
                href="/signupp"
                className="btn btn-outline-primary fw-bold shadow-sm px-4"
              >
                Create Account
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Login;
