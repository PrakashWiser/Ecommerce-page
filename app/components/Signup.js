"use client";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const Signup = () => {
  const [num, setNum] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password == repassword) {
      if (email == "" && password == "")
        return toast.error("invaild email or password");
      axios.post("https://66f0f85341537919154f06e7.mockapi.io/signup", {
        num,
        email,
        password,
      });
      setNum("");
      setEmail("");
      setPassword("");
      setRepassword("");
      router.push("/");
    } else {
      toast.warning("Miss Match Password");
    }
  };
  const DeleteData = (id) => {
    axios
      .delete(`https://66f0f85341537919154f06e7.mockapi.io/signup/${id}`)
      .then("https://66f0f85341537919154f06e7.mockapi.io/signup");
  };
  return (
    <div className="container d-flex flex-column justify-content-center align-items-center vh-100 text_white">
      <h1 className="fw-bold text-danger">Sign Up</h1>
      <form className="width_tybe" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Number
          </label>
          <input
            type="number"
            className="form-control"
            id="name"
            placeholder="Enter Number"
            value={num}
            onChange={(e) => setNum(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Eamil"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Conform Password
          </label>
          <input
            type="password"
            placeholder="Re-Enter  Password"
            className="form-control"
            id="repassword"
            value={repassword}
            onChange={(e) => setRepassword(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-between my-4 ">
          <button
            type="submit"
            className="btn btn-warning  fw-bold px-4 text-white"
          >
            Sign up
          </button>
          <button
            onClick={() => DeleteData("4")}
            type="submit"
            className="btn btn-danger  fw-bold px-4"
          >
            Delete
          </button>
        </div>
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
      </form>
    </div>
  );
};
export default Signup;
