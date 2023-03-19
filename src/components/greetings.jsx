import React from "react";
import "../App.css";
import { Heading, Text, Container, Highlight, Button, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FadeLoader from 'react-spinners/FadeLoader';


export default function Greetings(props) {


  const [scheduledTask, setScheduledTask] = useState([]);
  const [wishes, setWishes] = useState("")
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState([])
  const [data, setData] = useState([])

  const navigate = useNavigate()


  useEffect(() => {

  fetch(`${process.env.BASE_URL}/scheduled`, {
    method: 'GET',
    headers: {
      "Authorization": `Bearer ${localStorage.getItem("accessToken")}`
  }
  })
  .then(data => data.json())
  .then((res) => {
    setScheduledTask(res);
  });
  fetch(`${process.env.BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((data) => data.json())
        .then((res) => {
          console.log("data", res);
          setData(res);
          setLoading(false);
      });
  
}, [props.isScheduleChanged, props.isInCompleted]);

useEffect(() => {
  const token = localStorage.getItem("accessToken")
  fetch(`${process.env.BASE_URL}/users/userDetails`, {
      method: 'POST',
      body: JSON.stringify({
        token: token
      }),
      headers: {
        "Content-Type": "application/json"
       }
  })
    .then(data => data.json())
    .then((res) => {
      setLoggedUser(res.data)
      setLoading(false)
    })
    .catch((err) => {
      console.log(err);
    });
    fetch(`${process.env.BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((data) => data.json())
        .then((res) => {
          console.log("data", res);
          setData(res);
          setLoading(false);
      });
}, [])

// async function 

  return (
    <Container maxW="1000px">
      <div className="top-content">
      
        <Heading className="greetings" as="h1" size="2xl" noOfLines={1} style={{ padding: "10px"}}>
          Good Morning, {loggedUser.firstName}! 
        </Heading>
        <Text
          fontSize="s"
          style={{ padding: "10px", marginTop: "20px", color: "lightgrey" }}
        >
          Here is your today's briefing
          
        </Text>
        <div style={{ margin: "10px"}}>
        <Text fontSize='larger'>
          {`You have ${scheduledTask?.length} tasks scheduled today`}
        </Text>
        </div>

        <Text fontSize="larger"> 
        <div style={{ margin: "10px"}}>
        <Highlight
          query="4 new activity items"
          styles={{ px: "2", py: "1", mx:"1", my:"1", bg: "blue.100", borderRadius:"10px", fontWeight:"bold", color:"cornflowerblue" }}
        >
          There have been 4 new activity items since yesterday
        </Highlight>
        </div>
        </Text>
        
        <Text fontSize='larger'>
        <div style={{ margin: "10px"}}>
        <Highlight
          query="0 incompleted tasks"
          styles={{ px: "1", py: "1", mx:"1", my:"1", bg: "gray.100", borderRadius:"10px" }}
        >
          {`Just a Remainder!. Till Now, You have ${data?.length} incompleted tasks.`}
        </Highlight>
        </div>
      </Text>

      </div>
    </Container>
  );
}
