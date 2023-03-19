import React, {useRef} from "react";
import { Input, Textarea, Switch, FormControl, FormLabel, Button } from "@chakra-ui/react";
import "../App.css";
import { useState } from "react";
import { useEffect } from "react";

export default function CreateTodo() {
    const [handleInputError, setHandleInputError] = useState(false)
    const getSwitch = useRef()
    const getName = useRef()
    const getDescription = useRef()


    function submitTodo() {
        if(getName.current.value=='' || getDescription.current.value=='') {
            setHandleInputError(true)
        }
        
    }
   
  return (
    <div className="form">
      <Input ref={getName} variant="outline" placeholder="Todo name" isInvalid={handleInputError} />
      <Textarea ref={getDescription} placeholder="Description" isInvalid={handleInputError} />
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="email-alerts" mb="0">
          Enable email alerts?
        </FormLabel>
        <Switch style={{float:"right"}} ref={getSwitch} id="email-alerts" />
      </FormControl>
      <Button colorScheme='twitter' style={{marginTop:'20px', width:'100%'}} onClick={submitTodo}>Create This!</Button>
    </div>
  );
}
 