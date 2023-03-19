import React, {useState, useEffect} from "react";
import {
  Flex,
  Spacer,
  ButtonGroup,
  Avatar,
  Image,
  Box,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOpt,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import HeadImage from "../resources/png-transparent-todo-sketch-note-list-tasks-thumbnail.png"

export default function Navbar() {

    const [loggedUser, setLoggedUser] = useState([])

    const navigate = useNavigate()

    function handleLogout() {
        window.localStorage.removeItem("accessToken")
        window.localStorage.removeItem("userID")
        navigate("/login")
      }

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
            console.log('res', res);
            setLoggedUser(res.data)
          })
          .catch((err) => {
            console.log(err);
          });
      }, [])

  return (
    <div>
    <Flex minWidth="max-content" alignItems="center" gap="2" style={{margin: "30px"}}>
      <Box p="2">
        <Image src={HeadImage} width="30" height="10" />
      </Box>
      <Spacer />
      <ButtonGroup gap="2">
        <Menu>
          <MenuButton>
            <Avatar name={`${loggedUser.firstName} ${loggedUser.lastName}`} />
          </MenuButton>
          <MenuList minW="30px" style={{padding:"10px"}}>
            <MenuItem className="menuItem" onClick={handleLogout}>Logout</MenuItem>
          </MenuList>
        </Menu>
      </ButtonGroup>
    </Flex>
    </div>
  );
}
