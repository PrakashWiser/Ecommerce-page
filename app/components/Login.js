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
    <div className="container text-white d-flex flex-column justify-content-center align-items-center vh-100">
      <a href="https://github.com/prakashwiser/">
        <ImGithub className="fs-4 text-dark text_white" />
      </a>
      <h1 className="fw-bold text-success py-4">Sign in</h1>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="width_tybe">
            <div className="mb-3">
              <Field
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter Email"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="mb-3">
              <Field
                type="password"
                name="password"
                className="form-control"
                placeholder="Enter Password"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>
            <div className="d-flex justify-content-between mt-4">
              <button
                type="submit"
                className="btn btn-primary fw-bold"
                disabled={isSubmitting}
              >
                Sign in
              </button>
              <Link
                className="btn btn-primary fw-bold text-white"
                href="/signupp"
              >
                Create New Account
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
