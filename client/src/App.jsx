import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Chatbot from "./components/layout/Chatbot";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {

  return (
    <>
      <Chatbot></Chatbot>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    <ToastContainer/>
      
    </>
  );
}

export default App;
