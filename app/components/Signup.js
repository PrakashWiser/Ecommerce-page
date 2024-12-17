"use client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Link from "next/link";

const Signup = () => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    num: Yup.string()
      .matches(/^\d+$/, "Must contain only numbers")
      .required("Number is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    repassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = (values, { resetForm }) => {
    const { num, email, password } = values;

    axios
      .post("https://66f0f85341537919154f06e7.mockapi.io/signup", {
        num,
        email,
        password,
      })
      .then(() => {
        toast.success("Signup successful!");
        resetForm();
        router.push("/");
      })
      .catch(() => toast.error("Signup failed, please try again."));
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      <div
        className="card shadow p-4 w-100"
        style={{ maxWidth: "400px", borderRadius: "12px" }}
      >
        <h2 className="text-center fw-bold text-primary mb-4">Sign Up</h2>
        <Formik
          initialValues={{ num: "", email: "", password: "", repassword: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label htmlFor="num" className="form-label fw-semibold">
                  Number
                </label>
                <Field
                  type="text"
                  name="num"
                  id="num"
                  className="form-control"
                  placeholder="Enter your number"
                />
                <ErrorMessage
                  name="num"
                  component="div"
                  className="text-danger small"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email
                </label>
                <Field
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-danger small"
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
                  className="form-control"
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-danger small"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="repassword" className="form-label fw-semibold">
                  Confirm Password
                </label>
                <Field
                  type="password"
                  name="repassword"
                  id="repassword"
                  className="form-control"
                  placeholder="Re-enter your password"
                />
                <ErrorMessage
                  name="repassword"
                  component="div"
                  className="text-danger small"
                />
              </div>

              <div className="d-grid gap-2">
                <button
                  type="submit"
                  className="btn btn-primary fw-bold"
                  disabled={isSubmitting}
                >
                  Sign Up
                </button>
                <button type="reset" className="btn btn-outline-danger fw-bold">
                  Reset
                </button>
              </div>
            </Form>
          )}
        </Formik>
        <p className="text-center mt-3 small text-muted">
          Already have an account?{" "}
          <Link href="/" className="text-decoration-none text-primary">
            Login here
          </Link>
        </p>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
          draggable
        />
      </div>
    </div>
  );
};

export default Signup;
