"use client"
import { UserProvider, useUserContext } from "@/lib/contextapi/UserProvider";
import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Navbar from "@/components/ui/Navbar"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  
  import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
  } from "@/components/ui/drawer"
import Link from "next/link";
  

  const Home2=()=>{

    const [addInput,setAdd]=useState(false);
    const { state, dispatch } = useUserContext();
    const user=state.user;
    useEffect(()=>{
      console.log(state);

    },[])
    const [isFormDetailsDialogOpen, setFormDetailsDialogOpen] = useState(false);
    const [userForms, setUserForms] = useState([]);
    const [selectedForm, setSelectedForm] = useState(null);
  
 
  
    const fetchUserForms = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/form/userForms?userId=${String(user._id)}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
    
        if (response.ok) {
          const data = await response.json();
          setUserForms(data.forms);
          console.log(userForms);
        } else {
          console.error("Failed to fetch user forms. Status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch user forms:", error);
      }
    };
    
    const [response2 , setResponse]=useState([])
  const[inputs2,setInputs]=useState([]);
    // Trigger the fetchUserForms function when the component mounts or when the user state changes
    useEffect(() => {
      if (user) {
        fetchUserForms();
      }
    }, [user]);
    const handleFormClick = (formId) => {
      // Fetch and display form details when a form is clicked
      fetchFormDetails(formId);
    };
  
const fetchFormDetails = async (formId: string) => {
  try {
    const response = await fetch(`http://localhost:4000/api/v1/form/FormDetail?formId=${formId}`);

    if (response.ok) {
      setInputs([]);
      setResponse([]);
      const data = await response.json();
      console.log(data);
      setSelectedForm(data.form);
      console.log(selectedForm);
      setFormDetailsDialogOpen(true);

      // Fetch and display input details for each input
      data.form.input.forEach((inputId) => {
        fetchInputDetails(inputId);
      });

      // Fetch and display response details for each response
      data.form.response.forEach((responseId) => {
        fetchResponseDetails(responseId);
      });
    } else {
      console.error("Failed to fetch responses. Status:", response.status);
    }
  } catch (error) {
    console.error("Failed to fetch responses:", error);
  }
};

    const fetchInputDetails = async (inputId:string) => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/form/getINputDetails?inputId=${inputId}`);
    
        if (response.ok) {
          const data = await response.json();
         console.log(data);
         setInputs((prevData) => [...prevData, data]);
        console.log(inputs2);
        } else {
          console.error("Failed to fetch input. Status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch input:", error);
      }
    };

    const fetchResponseDetails = async (responseId:string) => {
      try {
        const response = await fetch(`http://localhost:4000/api/v1/form/getResponseDetails?responseId=${responseId}`);
    
        if (response.ok) {
          const data = await response.json();
         console.log(data);
         setResponse((prevData) => [...prevData, data]);
        console.log(response2);
        
        } else {
          console.error("Failed to fetch input. Status:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch input:", error);
      }
    };
    
    
    
    
    const setUser = (user:string) => {
      dispatch({ type: "SET_USER", payload: user });
    };
    interface InputData {
      field: string;
      type: string;
    }

    const [addedInputs, setAddedInputs] = useState<InputData[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    user:state.user._id,
  });
  const [inputData, setInput] = useState({
    formId:"",
    field: "",
    type:"",
    userId:state.user._id
  
   
    
  });
  const handleInputChange2 = (name:string, value:string) => {
    setInput((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      // Make a request to your server to invalidate the token and perform logout
      const response = await fetch("http://localhost:4000/api/v1/auth/logout", {
        method: "POST", // or "GET" depending on your server implementation
        headers: {
          "Content-Type": "application/json",
          // Include any necessary authentication headers (e.g., token)
          // ...
        },
        // Body can be empty for some logout implementations
        // body: JSON.stringify({}),
      });

      if (response.ok) {
        // Optionally, clear any user-related data from the frontend state
        console.log("Logout successful...");
        setUser("");
        localStorage.removeItem("token"); // Replace "yourTokenKey" with the actual key used to store the token
        localStorage.removeItem("user"); // Replace "yourTokenKey" with the actual key used to store the token


        // Redirect or perform any additional actions after successful logout
        // For example, you might redirect the user to the login page
        window.location.href = "/auth/login";
      } else {
        const errorData = await response.json();
        console.error("Error logging out:", errorData.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };


  const handleSubmit2 = async () => {
   
    console.log(inputData);
    try {

      const response = await fetch("http://localhost:4000/api/v1/form/addInput", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Input added Successfully", data);
        setAddedInputs((prevInputs) => [...prevInputs, { field: inputData.field, type: inputData.type }]);

      } else {
        console.error("failed. Status:", response.status);
      }
     

    } catch (error) {
      console.error("Failed", error);
    }
  };


  const handleInputChange = (name:string, value:string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    console.log(formData);
    try {

      const response = await fetch("http://localhost:4000/api/v1/form/createForm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Form Created Successfully", data);
        setInput((prevInputData) => {
          const updatedInputData = { ...prevInputData, formId: data.form._id };
          return updatedInputData;
        });
      } else {
        console.error("failed. Status:", response.status);
      }

    } catch (error) {
      console.error("Failed", error);
    }
  };


return(
    <div className="w-screen h-screen overflow-hidden min-h-screen bg-black text-white">
     <nav className="w-[80%]  mx-auto">
     <Navbar user={state.user} handleLogout={handleLogout}/>
     </nav>
     <div className="flex flex-col  flex-wrap h-[100%] items-center justify-around  w-[90%] mx-auto">
    <div className="z-10">
     <Dialog>
  <DialogTrigger><div className=" bg-white text-black p-4 rounded-lg">Add Form</div></DialogTrigger>
  <DialogContent>
    <DialogHeader>
     <div className=" flex flex-col items-center gap-3 justify-center ">
     <DialogTitle className="text-3xl">Form</DialogTitle>
      <DialogDescription>
     
       {
      addInput?(<>
       
      <div className="text-xl flex flex-col gap-4">
        <h1 className=" text-black">{formData.title}</h1>
        
      <Dialog>
  <DialogTrigger><div className="bg-black text-white p-4 rounded-lg" >Add Input</div></DialogTrigger>
  {addedInputs.length > 0 && (
        <div className=" bg-black text-white">
          <h1>Added Inputs:</h1>
          <ul className="flex flex-col justify-center items-center gap-4">
            {addedInputs.map((input, index) => (
              <li key={index}>{`${input.field} - ${input.type}`}</li>
            ))}
          </ul>
        </div>
      )}
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Input</DialogTitle>
      <DialogDescription>
     <div className=" flex flex-col items-center justify-center">
      <label>Enter the Label You Want to add</label>
      <input onChange={(e)=>{
        handleInputChange2("field",e.target.value);
      }}  name="field" className=" border-2" type="text"></input>
      <label>Enter the type of response you want</label>
      <select onChange={(e) => {
  handleInputChange2("type", e.target.value);
}}>
  <option value="text">Text</option>
  <option value="radio">Radio</option>
  <option value="checkbox">Checkbox</option>
</select>

<button className="bg-black text-white p-4 rounded-lg"  onClick={()=>{
  handleSubmit2();
 
}}>
  
  Add Input Section
</button>

     
     </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>


      </div>
      </>):(<>  <div className=" flex flex-col text-xl min-w-[100%] flex-wrap gap-3 items-center">
        <label className="text-black"> Enter the Title of the form</label>
        <input
            id="title"
            onChange={(e) => handleInputChange("title", e.target.value)}
        className="text-black border-4 " type="text"></input>
        <button onClick={()=>{
          handleSubmit();
          setAdd(true);
        }} className="bg-black text-white rounded-xl p-4" >Done</button>

       </div></>)
       }

       
     
      </DialogDescription>
     </div>
    </DialogHeader>
  </DialogContent>
</Dialog>

<div className="flex flex-col gap-4 items-center text-white">
          <h2 className="text-xl">Your Forms:</h2>
          {userForms.map((form) => (
            <div
              key={form._id}
              className="cursor-pointer text-blue-500 hover:underline"
              onClick={() => handleFormClick(form._id)}
            >
              {form.title}
            </div>
          ))}
        </div>
   <div className="bg-white text-black">     {selectedForm ?(
        <div onDoubleClick={()=>{
          setFormDetailsDialogOpen(false);
        }}>
           <Dialog open={isFormDetailsDialogOpen} onClose={() => setFormDetailsDialogOpen(false)}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Form Details  </DialogTitle>
    </DialogHeader>
    {/* Display all details of the form here */}
    <div className="bg-white text-black p-4 rounded-lg">
  <h2 className="text-xl">Form Details:</h2>
  <p>Title: {selectedForm ? selectedForm.title : "N/A"}</p>
  <h3>Form:</h3>
  <div className="bg-black text-white p-4">
  {inputs2.map((form, formIndex) => (
  <div key={formIndex}>
  
    <form>
      {form.inputs.map((inputData, index) => (
        <div className=" flex gap-4 items-center justify-center  mt-3" key={index}>
          <label>{inputData.field}</label>
          {inputData.type === 'text' && (
            <input type="text" />
          )}
          {inputData.type === 'radio' && (
            <input type="radio" />
          )}
          {inputData.type === 'checkbox' && (
            <input type="checkbox" />
          )}
          {/* Add more input types as needed */}
        </div>
      ))}
    </form>
  </div>
))}
  </div>



  <h3>Responses:</h3>
  {response2.map((responseData, index) => (
  <div key={index}>
    <p className=" bg-black text-white p-4">User: {responseData.response.Usera};</p>
    {responseData.response.answer && (
      <div>
        <h3>Answer:</h3>
        {Object.entries(responseData.response.answer).map(([key, value]) => (
          <div key={key}>
            <p>{key}: {value}</p>
          </div>
        ))}
      </div>
    )}
  </div>
))}



  {/* Add more form details as needed */}
</div>
<h1>Double click to close</h1>
  </DialogContent></Dialog>
          </div>
        ):(<></>)}</div>
     

     </div>
     {/* <div>
     <Drawer>
  <DrawerTrigger>Open</DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you absolutely sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

     </div> */}


     </div>
    </div>
)

}

export default Home2;
