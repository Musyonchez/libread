import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Input from "./components/Input";
import Display from "./components/Display";

const Index = () => {
  const [text, setText] = useState("");
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);


  return (
    <div className=" bg-white min-h-screen">
      <Navbar />
      <div className=" w-full flex flex-col justify-center items-center">
        <Input
          text={text}
          setText={setText}
          setFetchedContent={setFetchedContent}
        />
        <Display fetchedContent={fetchedContent} />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
