import { BrowserRouter, Routes, Route } from 'react-router-dom'
import io from 'socket.io-client' //same as in server, we do need this to make sure client can communicate to server

// import the Pages & Components
import Home from './pages/Home'
import Navbar from './components/Navbar'

const socket = io.connect("http://localhost:3002") //will call the server backend

function App()  {
  return (
    <div className='App'>
      <BrowserRouter>
      {/* Now call the Navbar components inside BrowserRouter not outside it */}
      <Navbar />
      <div className="pages">
        <Routes>
          <Route
            path="/"
            element={<Home />}
          />
        </Routes>
      </div>
      </BrowserRouter>
    </div>
  )
}
export default App;
