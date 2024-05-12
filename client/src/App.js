import './App.css';
// import hooks that works with React
import { useState, useEffect } from 'react';
// import Axios to simplify our API request
import Axios from 'axios';

// this function App() will run the page that intended to do, like this case is to show the list of the users information
function App() {
  // declare the array of 2 things: 
  //  1. listOfUsers-> the current state value
  //  2. setListOfUsers-> a function to update the value
  // useState has an empty array for its declaration
  const [listOfUsers, setListOfUsers] = useState([])

  // here is the user information for POST
  const [name, setName] = useState("")
  const [age, setAge] = useState(0)
  const [username, setUsername] = useState("")


  // The empty array [] passed as the second argument to useEffect is called the dependency array. It specifies the dependencies for the effect. 
  // When the dependency array is empty, it means that the effect should only run once, after the initial render of the component
  useEffect(()=>{
    // use axios to use the API, use .then() to do extra works after retrieving the data from API
    // response variable is used to hold the data retrieved by API and pass it to setListOfUsers function to modify listOfUsers
    Axios.get("http://localhost:3002/getUsers").then((response)=>{
      setListOfUsers(response.data)
    })
  },[]);

  // this is a function to do POST, which is submitting the new user information
  const createUser = ()=>{
    // however in post API, we need to pass the BODY which has the exact format {name,age,username} -> Hence u need to use useState again to keep the variables
    Axios.post("http://localhost:3002/createUser",{
      name: name,
      age: age,
      username: username
    }).then(()=>{
     setListOfUsers([...listOfUsers,{
      name: name,
      age: age,
      username: username
     }])
    })
  }

  return (
  <div className="App">
    <div className="usersDisplay">
      {listOfUsers.map((user)=>{
        return(
          <div>
            <h1>Name: {user.name}</h1>
            <h1>Age: {user.age}</h1>
            <h1>Username: {user.username}</h1>
          </div>
        )
      })}
    </div>

    <div className="createUserForm">
      <input 
        type='text' 
        placeholder='Name...' 
        onChange={(event)=>{
          setName(event.target.value)
        }}>   
        </input>
        <input 
        type='number' 
        placeholder='Age...' 
        onChange={(event)=>{
          setAge(event.target.value)
        }}>   
        </input>
        <input 
        type='text' 
        placeholder='Username...' 
        onChange={(event)=>{
          setUsername(event.target.value)
        }}>   
        </input>

      <button onClick={createUser}>Submit</button>
    </div>
  </div>
  );
}

export default App;
