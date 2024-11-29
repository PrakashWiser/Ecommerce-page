"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import { ImGithub } from "react-icons/im";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
const Login = () => {
  const [apiData, setApiData] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    axios
      .get("https://66f0f85341537919154f06e7.mockapi.io/signup")
      .then((response) => {
        setApiData(response.data);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      if (password) {
        let EmailData = apiData.filter((items) => items.email == email);
        if (EmailData.length == 0) {
          alert("can't see your email, pls register first");
          router.push("/Signup");
        } else {
          if (password == EmailData[0]?.password) {
            let Admin = EmailData[0].email;
            if (Admin == "prakashlunatic2@gmail.com") {
              router.push("/productsdetails");
              sessionStorage.setItem("Admin", EmailData[0].email);
            } else {
              router.push("/");
              localStorage.setItem("Data", EmailData[0].email);
            }
          } else {
            alert("please enter correct password");
          }
        }
      } else {
        alert("please fill the password");
      }
    } else {
      alert("please fill the email");
    }
  };

  return (
    <div className="container text-white d-flex flex-column justify-content-center align-items-center vh-100">
      <a href="https://github.com/prakashwiser/">
        <ImGithub className="fs-4 text-dark text_white" />
      </a>
      <h1 className="fw-bold text-success py-4">Sign in</h1>
      <form className="width_tybe" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
          />
        </div>
        <div className="d-flex justify-content-between mt-4">
          <button type="submit" className="btn btn-primary fw-bold">
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
