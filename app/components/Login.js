"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImGithub } from "react-icons/im";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Login = () => {
  const [apiData, setApiData] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("https://66f0f85341537919154f06e7.mockapi.io/signup")
      .then((response) => {
        setApiData(response.data);
      })
      .catch(() => toast.error("Failed to fetch user data"));
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
      toast.error("Can't find your email, please register first");
      router.push("/signupp");
    } else if (user.password !== password) {
      toast.warning("Incorrect password, please try again");
    } else {
      if (user.email === "prakashlunatic2@gmail.com") {
        sessionStorage.setItem("Admin", user.email);
        router.push("/adminproductsdetails");
      } else {
        localStorage.setItem("Data", user.email);
        router.push("/");
      }
    }
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-center">
        <a href="https://github.com/prakashwiser/" target="_blank" rel="noopener noreferrer">
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
              <Link href="/signupp" className="btn btn-outline-primary fw-bold shadow-sm px-4">
                Create Account
              </Link>
            </div>
          </Form>
        )}
      </Formik>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default Login;
