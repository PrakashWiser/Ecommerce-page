"use client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Signup = () => {
  const router = useRouter();

  const validationSchema = Yup.object().shape({
    num: Yup.string()
      .matches(/^\d+$/, "Must be a number")
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
        toast.success("Signup successful");
        resetForm();
        router.push("/");
      })
      .catch(() => toast.error("Failed to sign up"));
  };

  const deleteData = (id) => {
    axios
      .delete(`https://66f0f85341537919154f06e7.mockapi.io/signup/${id}`)
      .then(() => toast.success("Data deleted successfully"))
      .catch(() => toast.error("Failed to delete data"));
  };

  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text_white">
      <h1 className="fw-bold text-danger">Sign Up</h1>
      <Formik
        initialValues={{ num: "", email: "", password: "", repassword: "" }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="width_tybe">
            <div className="mb-3">
              <label htmlFor="num" className="form-label">
                Number
              </label>
              <Field
                type="text"
                name="num"
                className="form-control"
                placeholder="Enter Number"
              />
              <ErrorMessage
                name="num"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
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
              <label htmlFor="password" className="form-label">
                Password
              </label>
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

            <div className="mb-3">
              <label htmlFor="repassword" className="form-label">
                Confirm Password
              </label>
              <Field
                type="password"
                name="repassword"
                className="form-control"
                placeholder="Re-Enter Password"
              />
              <ErrorMessage
                name="repassword"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="d-flex justify-content-between my-4">
              <button
                type="submit"
                className="btn btn-warning fw-bold px-4 text-white"
                disabled={isSubmitting}
              >
                Sign up
              </button>
              <button
                type="button"
                onClick={() => deleteData("4")}
                className="btn btn-danger fw-bold px-4"
              >
                Delete
              </button>
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

export default Signup;
