import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import LoginForm from './Components/LoginForm';
import RegisterForm from './Components/RegisterForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Route for Login Page */}
        <Route 
          path="/LoginPage" 
          element={<LoginForm mode="login" />} 
        />
        
        {/* Route for Register Page */}
        <Route 
          path="/RegisterPage" 
          element={<RegisterForm mode="register" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;