import React from "react";
import Image from "next/image";
import formatDuration from "../utils/formatDuration";

interface VideoInfo {
  title: string;
  duration: number; // Duration in seconds
  thumbnail: string;
}

const SearchResults = ({ response }: { response: VideoInfo }) => {
  return (
    <div className=" flex flex-col w-full justify-center items-center">
      <div className=" bg-white p-3 w-11/12 flex flex-col">
        <h2>{response.title}</h2>
        <p>Duration: {formatDuration(response.duration)}</p>
        <Image
          src={response.thumbnail}
          alt={response.title}
          width={150} // Example width
          height={150} // Example height
        />
      </div>
    </div>
  );
};

export default SearchResults;
