import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import the Pages & Components
import Home from './pages/Home'
import Navbar from './components/Navbar'

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
