import React from "react";
import {
  Container,
  Card,
  Button,
  Text,
  FormControl,
  Input,
  Heading,
  useToast
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from 'yup';

export default function ForgotPassword() {

  const toast = useToast()

  const forgotFormik = useFormik({
    initialValues: {
      email: ""
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please enter email").email("Please enter valid email"),
    }),
    onSubmit: (values) => {
      fetch(`${process.env.BASE_URL}/users/forgot-password`, {
        method:'POST',
        body: {
          email: values.email,
        }
 
      })
        .then((response) => response.json())
        .then((data) => {
          if(data.status==="ok"){
            toast({
              title: `Password reset link sent to ${values.email}. Please check!`,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
            console.log(data.url)
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
      forgotFormik.resetForm();
    }
  })
  return (
    <div>
      <Container maxW="600px">
        <Card style={{marginTop: "100px", padding: "20px"}}>
            <Heading style={{textAlign:"center", margin:"20px"}}>Forgot Password ?</Heading>
            <Text margin="20px">
              Enter the email address associated with your account and we'll send you a link to reset the password.
            </Text>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              forgotFormik.handleSubmit();
              return false;
            }}
            style={{margin:"5px 20px"}}
          >
            <FormControl>
              <Input
                variant="filled"
                name="email"
                id="email"
                value={forgotFormik.values.email}
                onChange={forgotFormik.handleChange}
                onBlur={forgotFormik.handleBlur}
                placeholder="Email"
              />

              <div className="errorDiv">
                {forgotFormik.touched.email && forgotFormik.errors.email && (
                  <p style={{ color: "red", float: "left" }}>
                    {forgotFormik.errors.email}
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
              Continue
            </Button>
            </form>
        </Card>
      </Container>
    </div>
  );
}
