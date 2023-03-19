import React, {useState} from "react";
import { useFormik } from "formik";
import {
  FormControl,
  Container,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import "../../resources/form.css";
import { ArrowBackIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const LoginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please enter email ID").email("Please enter valid email"),
      password: Yup.string().required("Please enter password"),
    }),
    onSubmit: (values) => {
      fetch(`${process.env.REACT_APP_BASE_URL}/users/login`, {
        method: "POST",
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === "Login successful") {
            toast({
              title: data.status,
              status: "success",
              position: "top-right",
              isClosable: true,
            });

            localStorage.setItem("accessToken", data.accessToken);
            localStorage.setItem("userID", data.userID)
            LoginFormik.resetForm();
            navigate("/");
          } else {
            toast({
              title: data.status,
              status: "error",
              position: "top-right",
              isClosable: true,
            });
          }
        })
        .catch((err) => {
          toast({
            title: err,
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
    },
  });

  const toast = useToast();

  

  return (
    <Container className="register" maxW="1000px">
      <div className="row registerForm">
        <div className="col front-login">
          <div className="inner-content">
            <svg
              style={{ marginLeft: "40%" }}
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user-plus"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <line x1="20" y1="8" x2="20" y2="14" />
              <line x1="23" y1="11" x2="17" y2="11" />
            </svg>
            <h1 className="greeting">Hello, Friend!</h1>
            <p className="para">
              Enter your personal details to get started and enjoy journey with
              us
            </p>
            <Link to="/register">
              <Button
                type=""
                id="register"
                className="login"
                leftIcon={<ArrowBackIcon />}
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
        <div className="col content-reg">
          <h1 className="heading">Log In</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              LoginFormik.handleSubmit();
              return false;
            }}
            style={{ padding: "20px" }}
          >
            <FormControl>
              <Input
                className="formInput"
                variant="filled"
                name="email"
                id="email"
                value={LoginFormik.values.email}
                onChange={LoginFormik.handleChange}
                onBlur={LoginFormik.handleBlur}
                placeholder="Email"
              />

              <div className="errorDiv">
                {LoginFormik.touched.email && LoginFormik.errors.email && (
                  <p style={{ color: "red", float: "left" }}>
                    {LoginFormik.errors.email}
                  </p>
                )}
              </div>
            </FormControl>
            <FormControl>
            <InputGroup>
              <Input
                className="formInput"
                variant="filled"
                name="password"
                id="password"
                type={show ? 'text' : 'password'}
                value={LoginFormik.values.password}
                onChange={LoginFormik.handleChange}
                onBlur={LoginFormik.handleBlur}
                placeholder="Password"
              />

              <InputRightElement width="4.5rem">
                <Button variant="link" h="1.75rem" mt="20px" size="sm" onClick={handleClick}>
                  {show ? <ViewOffIcon/>: <ViewIcon />}
                </Button>
              </InputRightElement>
              </InputGroup>
              <div className="errorDiv">
                {LoginFormik.touched.password &&
                  LoginFormik.errors.password && (
                    <p style={{ color: "red", float: "left" }}>
                      {LoginFormik.errors.password}
                    </p>
                  )}
              </div>
            </FormControl>
            <div style={{ padding: "15px" }}>
              <div className="row">
                <div className="col"></div>
                <div className="col">
                  <Link to="/forgot-password">
                    <Button
                      variant="link"
                      style={{
                        color: "black",
                        fontWeight: "lighter",
                        fontSize: "13px",
                      }}
                    >
                      Forgot Password ?
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <Button
              className="button-design"
              size="sm"
              variant="outline"
              type="submit"
            >
              {" "}
              Login
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
