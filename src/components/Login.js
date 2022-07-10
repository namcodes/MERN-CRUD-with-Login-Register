import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from 'axios';

import "../styles/Styles.css";

function Login() {
  const token = localStorage.getItem("token");

  if(token){
    window.location.href = "/dashboard";
  }

  const input = { email: "", password: "" };
  const [formValues, setFormValues] = useState(input);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validation(formValues));
    setSubmit(true);
  };

  useEffect(() => {
    
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      axios
      .post("http://localhost:3001/api/login", {
        ...formValues,
      })
      .then(function (response) {
        if (response.data.status === "success") {
          Swal.fire({
            title: "SUCCESS",
            text: "Signed In Successfully",
            icon: "success",
            showConfirmButton: false,
            timer: 1500,
          });
          setTimeout(() => {
            localStorage.setItem('token', response.data.user);
            window.location.href = "/dashboard";
          }, 1500);
        } else {
          setSubmit(false);
          Swal.fire({
            title: "ERROR",
            text: response.data.status,
            icon: "error",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }, [formErrors, isSubmit, formValues]);

  const validation = (values) => {
    const errors = {};
    const regex = /[a-zA-Z0-9]+@(gmail|yahoo|outlook)+.(com)$/;

    if (!values.email) {
      errors.email = "Please enter your Email address";
    } else {
      if (!regex.test(values.email)) {
        errors.email = "Please enter a valid Email address.";
      }
    }

    if (!values.password) {
      errors.password = "Please enter your password";
    }

    return errors;
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Login to Code Nam</h1>
      </header>
      <form onSubmit={handleSubmit}>
        <div className="input-group-error">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              name="email"
              value={formValues.email}
              onChange={handleChange}
            />
          </div>
          <span className="error-text">{formErrors.email}</span>
        </div>
        <div className="input-group-error">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={formValues.password}
              onChange={handleChange}
            />
          </div>
          <span className="error-text">{formErrors.password}</span>
        </div>
        <div className="button-group">
          <button type="submit">Sign In</button>
          <p className="a-link">
            Not yet registered? <a href="/register">Sign Up</a>
          </p>
        </div>
      </form>
    </div>
  );
}

export default Login;
