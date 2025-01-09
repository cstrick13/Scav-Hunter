import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './views/LoginPage.jsx';
import UserPage from './pages/UserPage.jsx';


function App() {

  return (
    <>  
      <BrowserRouter>
        <Routes>
          <Route index element={<LoginPage />} />
          <Route path="/user/:uid" element={<UserPage />} />
        </Routes>
      </BrowserRouter>
      
        
    </>
  )
}

export default App
