import React, {useState} from "react";
import  { useFormik } from "formik";
import "../../resources/form.css";
import {
  FormControl,
  Container,
  FormLabel,
  Input,
  Button,
  useToast,
  InputGroup,
  InputRightElement
} from "@chakra-ui/react";
import * as Yup from "yup";
import { ArrowForwardIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);

  const navigate = useNavigate();
  const registerFormik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("Please enter first name"),
      lastName: Yup.string().required("Please enter last name"),
      email: Yup.string().required("Please enter email").email("Please enter valid email"),
      password: Yup.string().required("Please enter password"),
    }),
    onSubmit: (values) => {
      console.log(values);
      fetch("http://localhost:4000/users/register", {
        method: "POST",
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
        headers: {
          "Content-type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          toast({
            title: data.status,
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          navigate("/login");
        })
        .catch((err) => {
          toast({
            title: err,
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
      registerFormik.resetForm();
    },
  });

  const toast = useToast();

  return (
    <Container className="register" maxW="1000px">
      <div className="row registerForm">
        <div className="col content-reg">
          <h1 className="heading">Sign Up</h1>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerFormik.handleSubmit();
              return false;
            }}
            style={{ padding: "20px" }}
          >
            <FormControl>
              <Input
                className="formInput"
                name="firstName"
                id="firstName"
                variant="filled"
                value={registerFormik.values.firstName}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="First name"
              />
              <div className="errorDiv">
                {registerFormik.touched.firstName &&
                  registerFormik.errors.firstName && (
                    <p style={{ color: "red", float: "left" }}>
                      {registerFormik.errors.firstName}
                    </p>
                  )}
              </div>
            </FormControl>
            <FormControl>
              <Input
                className="formInput"
                name="lastName"
                id="lastName"
                variant="filled"
                value={registerFormik.values.lastName}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="Last name"
              />

              <div className="errorDiv">
                {registerFormik.touched.lastName &&
                  registerFormik.errors.lastName && (
                    <p style={{ color: "red", float: "left" }}>
                      {registerFormik.errors.lastName}
                    </p>
                  )}
              </div>
            </FormControl>
            <FormControl>
              <Input
                className="formInput"
                name="email"
                id="email"
                variant="filled"
                value={registerFormik.values.email}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="Email"
              />
              <div className="errorDiv">
                {registerFormik.touched.email &&
                  registerFormik.errors.email && (
                    <p style={{ color: "red", float: "left" }}>
                      {registerFormik.errors.email}
                    </p>
                  )}
              </div>
            </FormControl>
            <FormControl>
            <InputGroup>

              <Input
                className="formInput"
                name="password"
                id="password"
                variant="filled"
                type={show ? 'text' : 'password'}
                value={registerFormik.values.password}
                onChange={registerFormik.handleChange}
                onBlur={registerFormik.handleBlur}
                placeholder="Password"
              />

                

                <InputRightElement width="4.5rem">
                  <Button
                    variant="link"
                    h="1.75rem"
                    mt="20px"
                    size="sm"
                    onClick={handleClick}
                  >
                    {show ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              <div className="errorDiv">
                {registerFormik.touched.password &&
                  registerFormik.errors.password && (
                    <p style={{ color: "red", float: "left" }}>
                      {registerFormik.errors.password}
                    </p>
                  )}
              </div>
            </FormControl>
            <Button
              className="button-design"
              size="sm"
              variant="outline"
              type="submit"
            >
              {" "}
              Register
            </Button>
          </form>
        </div>
        <div className="col front-register">
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
              className="feather feather-log-in"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <h1 className="greeting">Welcome Back!</h1>
            <p className="para">
              To keep connected with us please login with your personal info
            </p>
            <Link to="/login">
              <Button
                type=""
                id="register"
                className="login"
                rightIcon={<ArrowForwardIcon />}
              >
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
