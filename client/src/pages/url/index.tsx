import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Input from "./components/Input";
import Display from "./components/Display";
import Control from "./components/Control";
import { PlaybackProvider } from "../url/components/context/PlaybackContext";

const Index = () => {
  const [text, setText] = useState("");
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);

  return (
    <PlaybackProvider>
      <div className=" bg-white text-black min-h-screen">
        <Navbar />
        <div className=" w-full flex flex-col justify-center items-center">
          <Control/>
          <Input
            text={text}
            setText={setText}
            setFetchedContent={setFetchedContent}
          />
          {/* <p>hscfsiufchs{fetchedContent}</p> */}
          <Display fetchedContent={fetchedContent} />
        </div>
        <Footer />
      </div>
    </PlaybackProvider>
  );
};

export default Index;
