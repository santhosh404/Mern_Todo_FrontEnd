import React, { useEffect, useRef, useState } from "react";
import {
  Container,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Box,
  Text,
  Button,
  useToast,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Textarea,
  FormControl,
  FormLabel,
  Spinner,
} from "@chakra-ui/react";

import { DeleteIcon, EditIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faCalendar,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-date-picker";
import { useFormik } from "formik";
import * as Yup from "yup";
import useDebounce from "../utils/useDebounce";

export default function Todo(props) {
  const [userTodo, setUserTodo] = useState([]);
  const [scheduledTask, setScheduledTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [value, onChange] = useState(new Date());
  const [isUpdatePopUp, setIsUpdatePopUp] = useState(false);
  const [activeData, setActiveData] = useState();
  const [isCompletedChanged, setIsCompletedChanged] = useState(false);
  const [flag, setFlag] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [isCompletedPage, setIsCompletedPage] = useState(false)
  let debouncedValue = useDebounce(value, 3000);

  const [isOpen, setIsOpen] = useState(false);

  const toast = useToast();

  const myDiv = useRef(null);

  const Formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      scheduledAt: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please enter name"),
      description: Yup.string().required("Please enter description"),
    }),
    onSubmit: (values) => {
      console.log(value);
      fetch("http://localhost:4000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          id: localStorage.getItem("userID"),
          name: values.name,
          description: values.description,
          scheduledAt: value,
          isCompleted: false,
        }),
      })
        .then((data) => data.json())
        .then((res) => {
          props.setIsInCompleted(!props.isInCompleted)
          toast({
            title: `${res.name} created successfully!`,
            status: "success",
            position: "top-right",
            isClosable: true,
          });
          fetch("http://localhost:4000/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
          .then((data) => data.json())
          .then((res) => {
            setIsCompletedPage(false)
            setUserTodo(res);
            setIsOpen(false);
            props.setIsScheduleChanged((prev) => !prev);
          });
        })
        .catch((err) => {
          toast({
            title: err,
            status: "error",
            position: "top-right",
            isClosable: true,
          });
        });
      Formik.resetForm();
    },
  });

  useEffect(() => {
    if (activeData) {
      console.log(activeData);
      Formik.values.name = activeData.name;
      Formik.values.description = activeData.description;
      value.scheduledAt = new Date(activeData.scheduledAt);
    }
  }, [activeData]);

  function HandleUpdate(value) {
    setIsUpdatePopUp(true);
    setIsOpen(true);
    setActiveData(value);
  }

  function handleDelete(value) {
    setLoading(true);
    const name = value.name;
    fetch(`http://localhost:4000/${value._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then(() => {
        const dueToday = document.querySelector(".dueToday");
        const completed = document.querySelector(".completed");
        dueToday.classList.remove("active");
        completed.classList.remove("active");
        fetch("http://localhost:4000/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
          .then((data) => data.json())
          .then((res) => {
            props.setIsInCompleted(!props.isInCompleted)
            setIsCompletedChanged(prev => !prev)
            setUserTodo(res);
            setLoading(false);
            props.setIsScheduleChanged((prev) => !prev);
            toast({
              title: `Successfully Deleted "${name}" Item.`,
              status: "success",
              position: "top-right",
              isClosable: true,
            });
          });
      })
      .catch((err) => {
        toast({
          title: err,
          status: "error",
          position: "top-right",
          isClosable: true,
        });
      });
  }

  function handleCompleted(obj, e) {
    setLoading(true)
    fetch(`http://localhost:4000/makeCompleted/${obj._id}`, {
      method:"PATCH",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
      }
    }).then(data => data.json()).then(res => {
      toast({
        title: `${res.status}!`,
        status: "success",
        position: "top-right",
        isClosable: true,
      });

      fetch("http://localhost:4000/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((data) => data.json())
        .then((res) => {
          props.setIsInCompleted(prev => !prev)
          setIsCompletedChanged(prev => !prev)

          setUserTodo(res);
          setLoading(false);
        });
    })

  }

  function handleOnChange(searchValue) {
    setLoading(true);
    fetch("http://localhost:4000/searchTodo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({
        todo: searchValue.target.value,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        setLoading(false);
        setUserTodo(res.filteredTodos);
      });
  }

  function createdAt(DateTime) {
    const date = new Date(DateTime);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    // const timeDifference = 330; // 5.5 hours (IST is 5.5 hours ahead of UST)
    // const localDate = new Date(date.getTime() + (timeDifference * 60 * 60 * 1000));
    const output = date.toLocaleDateString("en-IN", options);
    return output;
  }

  useEffect(() => {
    if (flag === 1) {
      console.log("if here");
      setLoading(true);
      fetch("http://localhost:4000/scheduled", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((data) => data.json())
        .then((response) => {
          setLoading(false);
          setUserTodo(response);
        });
    } else {
      console.log("else here");
      fetch("http://localhost:4000/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((data) => data.json())
        .then((res) => {
          setIsCompletedPage(false)
          setUserTodo(res);
          setLoading(false);
        });
    }
    fetch("http://localhost:4000/scheduled", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        setScheduledTask(res);
      });
  }, [flag, props.isScheduleChanged]);

  useEffect(() => {
    fetch("http://localhost:4000/completed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        console.log("com",res.completed);
        setCompleted(res.completed);
      });
  }, [isCompletedChanged])

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [loading]);

  function handleDueTodayActive(e) {
    console.log("clicked");
    setIsCompletedPage(false)
    setLoading(true)
    const dueToday = document.querySelector(".dueToday");
    const completed = document.querySelector(".completed");

    dueToday.classList.remove("active");
    completed.classList.remove("active");
    e.target.classList.add("active");
    fetch("http://localhost:4000/scheduled", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        setLoading(false)
        setUserTodo(res);
      });
  }
  function handleCompletedActive(e) {
    // setFlag(1)
    setIsCompletedPage(true)
    const dueToday = document.querySelector(".dueToday");
    const completed = document.querySelector(".completed");

    dueToday.classList.remove("active");
    completed.classList.remove("active");
    e.target.classList.add("active");
    setLoading(true)

    fetch("http://localhost:4000/completed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        console.log("com",res.completed);
        setLoading(false)
        setUserTodo(res.completed);
      });
  }

  function clearFilter() {
    setLoading(true)

    const dueToday = document.querySelector(".dueToday");
    const completed = document.querySelector(".completed");
    dueToday.classList.remove("active");
    completed.classList.remove("active");
    fetch("http://localhost:4000/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    })
      .then((data) => data.json())
      .then((res) => {
        setIsCompletedPage(false)
        console.log("data", res);
        setUserTodo(res);
        setLoading(false);
      });
  }

  return (
    <Container maxW="1000px">
      <div>
        {loading && (
          <React.Fragment>
            <div className="loading d-flex align-items-center justify-content-center">
              <div className="me-2">
                <Spinner />
              </div>
              <h1> Loading Todos</h1>
            </div>
            <div className="overlay"></div>
          </React.Fragment>
        )}
      </div>

      <Modal isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              Formik.handleSubmit();
              return false;
            }}
          >
            {isUpdatePopUp ? (
              <ModalHeader>Update Here!</ModalHeader>
            ) : (
              <ModalHeader className="addmodalheader">
                ADD THE ONE HERE!
              </ModalHeader>
            )}

            <ModalCloseButton
              onClick={() => {
                Formik.resetForm();
                setIsOpen(false);
              }}
            />
            <ModalBody>
              <FormControl>
                {/* <FormLabel>Todo Name</FormLabel> */}
                <Input
                  id="name"
                  name="name"
                  placeholder="Todo name"
                  value={Formik.values.name}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                <div className="errorDiv">
                  {Formik.touched.name && Formik.errors.name && (
                    <p style={{ color: "red" }}>{Formik.errors.name}</p>
                  )}
                </div>
              </FormControl>

              <FormControl mt={4}>
                {/* <FormLabel>Scheduled At</FormLabel> */}
                <DatePicker value={value} onChange={onChange} />
              </FormControl>

              <FormControl mt={4}>
                {/* <FormLabel>Description</FormLabel> */}
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={Formik.values.description}
                  onChange={Formik.handleChange}
                  onBlur={Formik.handleBlur}
                />
                <div className="errorDiv">
                  {Formik.touched.description && Formik.errors.description && (
                    <p style={{ color: "red" }}>{Formik.errors.description}</p>
                  )}
                </div>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                className="close-task"
                variant="outline"
                size="sm"
                mr={3}
                onClick={() => {
                  Formik.resetForm();
                  setIsOpen(false);
                }}
              >
                CLOSE
              </Button>
              {isUpdatePopUp ? (
                <Button
                  className="button-design"
                  size="sm"
                  variant="outline"
                  type="submit"
                  onClick={() => setIsOpen(true)}
                >
                  {" "}
                  Update Task
                </Button>
              ) : (
                <Button
                  className="add-task"
                  size="sm"
                  variant="outline"
                  type="submit"
                  onClick={() => {
                    setIsOpen(true);
                  }}
                >
                  {" "}
                  ADD TASK
                </Button>
              )}
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>

      <div className="row" id="row">
        <div className="col-5">
          <div className="wrapper" style={{ margin: "10px 20px 20px 20px" }}>
            <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
            <Input
              className="input"
              type="text"
              placeholder="Search Todos.."
              onChange={handleOnChange}
            />
          </div>
          <Box style={{ margin: "20px" }}>
            <Button className="clearfilter" onClick={clearFilter}>RESET</Button>
            <Button
              className="dueToday toggleButton"
              id="dueToday"
              onClick={handleDueTodayActive}
            >
              {" "}
              <FontAwesomeIcon className="calendarIcon" icon={faCalendar} /> DUE
              TODAY{" "}
              <span className="notification">{scheduledTask?.length}</span>{" "}
            </Button>
            <Button
              className="completed toggleButton"
              id="completed"
              onClick={handleCompletedActive}
            >
              <FontAwesomeIcon className="calendarIcon" icon={faCheckDouble} />{" "}
              COMPLETED{" "}
              <span className="notification">{completed?.length}</span>
            </Button>
            <Divider />
            <Button
              className="createTask"
              onClick={() => {
                setIsUpdatePopUp(false);
                setIsOpen(true);
              }}
              size="sm"
              variant="outline"
              style={{ float: "right" }}
            >
              CREATE TASK
            </Button>
          </Box>
        </div>
        
        {!isCompletedPage? <div className="col-7 content" ref={myDiv}>
          {userTodo.length === 0 && !loading && (
            <p style={{ textAlign: "center", margin: "20px" }}>
              No Records found.
            </p>
          )}
          {userTodo
            .map((elem, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <Box style={{ margin: "0px 20px 20px 20px" }}>
                  <Card variant="elevated" className="Card">
                    <CardHeader>
                      <div>
                        <Tooltip label={elem.name} placement="bottom-end">
                          <Heading size="sm" className="notesTitle">
                            {elem.name}
                          </Heading>
                        </Tooltip>

                        <div style={{ float: "right" }}>
                          <div className="row">
                          
                            <div className="col">
                            <Tooltip label="Delete" placement="bottom-end">
                              <DeleteIcon
                                onClick={() => handleDelete(elem)}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                            </div>
                            <div className="col">
                            <Tooltip label="Edit" placement="bottom-end">
                              <EditIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => HandleUpdate(elem)}
                              />
                            </Tooltip>
                            </div>

                            <div className="col">
                            <Tooltip label="Move to completed" placement="bottom-end">
                              <ArrowForwardIcon
                                onClick={() => handleCompleted(elem)}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                            </div>
                          </div>
                        </div>

                        {/* <p style={{ float: "right" }}>
                          completed{" "}
                          <Switch
                            id="isChecked"
                            isChecked={elem.isCompleted}
                            onChange={(e) => handleCompleted(elem, e)}
                          />{" "}
                        </p> */}
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Text>{elem.description}</Text>
                    </CardBody>
                    <small
                      style={{
                        padding: "0px 0px 10px 20px",
                        marginTop: "10px",
                      }}
                    >
                      {createdAt(elem.createdAt)}
                    </small>
                  </Card>
                  <Divider mt="20px" />
                </Box>
              </div>
            ))}
        </div>: <div className="col-7 content" ref={myDiv}>
          {userTodo.length === 0 && !loading && (
            <p style={{ textAlign: "center", margin: "20px" }}>
              No Records found.
            </p>
          )}
          {userTodo
            // .filter((item) => item.isCompleted)
            .map((elem, index) => (
              <div key={index} style={{ marginBottom: "20px" }}>
                <Box style={{ margin: "0px 20px 20px 20px" }}>
                  <Card variant="elevated" className="Card">
                    <CardHeader>
                      <div>
                        <Tooltip label={elem.name} placement="bottom-end">
                          <Heading size="sm" className="notesTitle">
                            {elem.name}
                          </Heading>
                        </Tooltip>

                        <div style={{ float: "right" }}>
                          <div className="row">
                          
                            <div className="col">
                            <Tooltip label="Delete" placement="bottom-end">
                              <DeleteIcon
                                onClick={() => handleDelete(elem)}
                                style={{ cursor: "pointer" }}
                              />
                            </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <Text>{elem.description}</Text>
                    </CardBody>
                    <small
                      style={{
                        padding: "0px 0px 10px 20px",
                        marginTop: "10px",
                      }}
                    >
                      {createdAt(elem.createdAt)}
                    </small>
                  </Card>
                  <Divider mt="20px" />
                </Box>
              </div>
            ))}
        </div>}
        
      </div>
    </Container>
  );
}
