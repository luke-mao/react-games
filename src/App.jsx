import React from "react";
import Modal from "@/components/Modal";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import MainPage from "@/pages/MainPage";

export default function App() {
  return (
    <div className="w-full h-screen bg-amber-50">
      <Modal/>
      <div className="w-full h-screen">
        <Sidebar/>
        <Footer/>
        <MainPage/>
      </div>
    </div>
  );
}
