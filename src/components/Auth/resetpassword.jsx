import React, {useState, useEffect} from "react";
import {
    Container,
    Card,
    Button,
    Text,
    FormControl,
    Input,
    Heading,
    useToast,
    InputGroup,
    InputRightElement
  } from "@chakra-ui/react";
  import { useFormik } from "formik";
  import * as Yup from 'yup';
  import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
  import Error404 from "../Errors/404";
  import { useNavigate, useParams, useSearchParams } from "react-router-dom";




export default function ResetPassword () {

    const [passwordShow, setPasswordShow] = useState(false);
    const [passwordConfirmShow, setPasswordConfirmShow] = useState(false);
    const handlePasswordClick = () => setPasswordShow(!passwordShow);
    const handleConfirmPasswordClick = () => setPasswordConfirmShow(!passwordConfirmShow);
    const toast = useToast()
    const navigate = useNavigate()
    const {id, token} = useParams()
    const [isVerified, setIsVerified] = useState(false)

  const resetFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: ""
    },
    validationSchema: Yup.object({
      password: Yup.string().required("Please enter password"),
      confirmPassword: Yup.string().required("Please enter confirm password").oneOf([Yup.ref('password'), null], 'Passwords must match')
    }),
    onSubmit: (values) => {
      console.log(values)
      fetch(`${process.env.REACT_APP_BASE_URL}/users/reset-password/${id}/${token}`, {
        method: "PATCH",  
        headers: {
          "Content-type": "application/json",
        },
        body: 
          JSON.stringify({
            password: values.password,
          })
        
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if(data.status==="ok"){
            toast({
              title: data.message,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            navigate("/login")
          }
          else {
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
        resetFormik.resetForm();
    }
  })



  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/users/reset-password/${id}/${token}`)
    .then((data) => data.json()).then(response => {
      console.log(response);
      if(response.status !== "ok") {
        console.log("here");
        navigate('/notfound')
      }
      console.log(isVerified);

      // if(!isVerified) {
      //   
      // }

    })
  }, [])
    return (
        <div>
      <Container maxW="600px">
        <Card style={{marginTop: "100px", padding: "20px"}}>
            <Heading style={{textAlign:"center", margin:"20px 0px 0px 0px"}}>Reset Password</Heading>
            <Text margin="20px">
              Enter the new password that you want to reset. Your new password must be different from previous password.
            </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              resetFormik.handleSubmit();
              return false;
            }}
            style={{margin:"5px 20px"}}
          >
           <FormControl>
            <InputGroup>
              <Input
                className="formInput"
                variant="filled"
                name="password"
                id="password"
                type={passwordShow ? 'text' : 'password'}
                value={resetFormik.values.password}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                placeholder="Password"
              />

              <InputRightElement width="4.5rem">
                <Button variant="link" h="1.75rem" mt="20px" size="sm" onClick={handlePasswordClick}>
                  {passwordShow ? <ViewOffIcon/>: <ViewIcon />}
                </Button>
              </InputRightElement>
              </InputGroup>
              <div className="errorDiv">
                {resetFormik.touched.password &&
                  resetFormik.errors.password && (
                    <p style={{ color: "red", float: "left" }}>
                      {resetFormik.errors.password}
                    </p>
                  )}
              </div>
            </FormControl>

            <FormControl>
            <InputGroup>
              <Input
                className="formInput"
                variant="filled"
                name="confirmPassword"
                id="confirmPassword"
                type={passwordConfirmShow ? 'text' : 'password'}
                value={resetFormik.values.confirmPassword}
                onChange={resetFormik.handleChange}
                onBlur={resetFormik.handleBlur}
                placeholder="Confirm Password"
              />

              <InputRightElement width="4.5rem">
                <Button variant="link" h="1.75rem" mt="20px" size="sm" onClick={handleConfirmPasswordClick}>
                  {passwordConfirmShow ? <ViewOffIcon/>: <ViewIcon />}
                </Button>
              </InputRightElement>
              </InputGroup>
              <div className="errorDiv">
                {resetFormik.touched.confirmPassword &&
                  resetFormik.errors.confirmPassword && (
                    <p style={{ color: "red", float: "left" }}>
                      {resetFormik.errors.confirmPassword}
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
              Confirm
            </Button>
            </form>
        </Card>
      </Container>
    </div>
    )
}