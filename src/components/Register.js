import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import {
  passwordCharacter,
  passwordDigits,
  passwordLowercase,
  passwordUppercase,
  validEmail,
  validLetter,
} from "./validation";

import "../styles/Styles.css";

function Register() {
  const token = localStorage.getItem("token");

  if(token){
    window.location.href = "/dashboard";
  }
  
  const input = {
    fname: "",
    lname: "",
    email: "",
    password: "",
    cpassword: "",
  };

  const [inputValues, setformValues] = useState(input);
  const [inputErrors, setInputErrors] = useState({});
  const [isSubmit, setSubmit] = useState(false);
  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setformValues({ ...inputValues, [name]: value });
  };

  const onSubmitHandle = (e) => {
    e.preventDefault();
    setInputErrors(validations(inputValues));
    setSubmit(true);
  };

  useEffect(() => {

    if (Object.keys(inputErrors).length === 0 && isSubmit) {
      axios
        .post("http://localhost:3001/api/register", {
          ...inputValues,
        })
        .then(function (response) {
          if (response.data.status === "success") {
            Swal.fire({
              title: "SUCCESS",
              text: "Successfully Registered",
              icon: "success",
              showConfirmButton: false,
              timer: 1500,
            });
            setTimeout(() => {
              window.location.href = "/";
            }, 1500);
          } else {
            Swal.fire({
              title: "ERROR",
              text: response.data.status,
              icon: "error",
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [inputErrors, isSubmit, inputValues]);

  const validations = (values) => {
    const errors = {};

    //Email address validation
    if (!values.email) {
      errors.email = "Please enter your Email address.";
    } else {
      if (!validEmail.test(values.email)) {
        errors.email = "Please enter a valid Email address.";
      }
    }

    //First name validation
    if (!values.fname) {
      errors.fname = "Please enter your First Name.";
    } else {
      if (!validLetter.test(values.fname)) {
        errors.fname = "Please enter valid First Name.";
      }
    }

    //Last name validation
    if (!values.lname) {
      errors.lname = "Please enter your Last Name.";
    } else {
      if (!validLetter.test(values.lname)) {
        errors.lname = "Please enter valid Last Name.";
      }
    }

    //Password validation
    if (!values.password) {
      errors.password = "Please enter your Password.";
    } else if (values.password.length < 8) {
      errors.password = "Password must at least 8 characters in length.";
    } else if (!passwordLowercase.test(values.password)) {
      errors.password =
        "Password must contain at least one lowercase character.";
    } else if (!passwordUppercase.test(values.password)) {
      errors.password =
        "Password must contain at least one uppercase character.";
    } else if (!passwordCharacter.test(values.password)) {
      errors.password = "Password must contain at least one special character.";
    } else if (!passwordDigits.test(values.password)) {
      errors.password = "Password must contain at least one digit.";
    }

    //Confirm validation
    if (values.cpassword) {
      if (values.password !== values.cpassword) {
        errors.cpassword = "Password does not matched.";
      }
    }

    return errors;
  };

  return (
    <div className="wrapper">
      <header>
        <h1>Sign Up to Code Nam</h1>
      </header>
      <form onSubmit={onSubmitHandle}>
        <div className="d-flex">
          <div className="input-group-error">
            <div className="form-group">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                name="fname"
                value={inputValues.fname}
                onChange={onChangeHandle}
              />
            </div>
            <span className="error-text">{inputErrors.fname}</span>
          </div>
          <div className="input-group-error">
            <div className="form-group">
              <label htmlFor="lname">Last Name</label>
              <input
                type="text"
                name="lname"
                value={inputValues.lname}
                onChange={onChangeHandle}
              />
            </div>
            <span className="error-text">{inputErrors.lname}</span>
          </div>
        </div>

        <div className="input-group-error">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="text"
              name="email"
              value={inputValues.email}
              onChange={onChangeHandle}
            />
          </div>
          <span className="error-text">{inputErrors.email}</span>
        </div>
        <div className="input-group-error">
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              value={inputValues.password}
              onChange={onChangeHandle}
            />
          </div>
          <span className="error-text">{inputErrors.password}</span>
        </div>
        <div className="input-group-error">
          <div className="form-group">
            <label htmlFor="cpassword">Confirm Password</label>
            <input
              type="password"
              name="cpassword"
              value={inputValues.cpassword}
              onChange={onChangeHandle}
            />
          </div>
          <span className="error-text">{inputErrors.cpassword}</span>
        </div>
        <div className="button-group">
          <button type="submit">Sign Up</button>
          <div className="a-link">
            <p>
              Already have an account? <a href="/">Sign In</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
