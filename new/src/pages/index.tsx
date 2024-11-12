import dynamic from "next/dynamic";

const TextToSpeech = dynamic(() => import("./components/TextToSpeech"), {
  ssr: false,
});

export default function Home() {
  return (
    <div>
      <h1>Text to Speech Demo</h1>
      <TextToSpeech />
    </div>
  );
}
