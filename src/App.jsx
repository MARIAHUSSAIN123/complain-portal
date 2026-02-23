import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import Admin from "./pages/Admin";
import Complain from "./pages/Complain";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import MyComplain from "./pages/MyComplain";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <BrowserRouter>
   <Routes>
  <Route path='/' element={<SignUp/>}/>
  <Route path='/login' element={<Login/>}/>
  <Route path='/dashboard' element={<Dashboard/>}/>
  <Route path='/complain' element={<Complain/>}/>
  <Route path='/mycomplain' element={<MyComplain/>}/>
  <Route path='/admin' element={<Admin/>}/>
</Routes>
    </BrowserRouter>
  );
}