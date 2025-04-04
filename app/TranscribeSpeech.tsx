// TranscribeSpeech.tsx
import React, { useRef, useState } from "react";
import { readBlobAsBase64 } from "./utils/readBlobAsBase64"; // adjust path if needed

const TranscribeSpeech = () => {
  const [transcript, setTranscript] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Function to send audio data to backend for synchronous transcription
  const transcribeVoice = async (base64Audio: string, languageCode: string): Promise<void> => {
    try {
      const response = await fetch('http://localhost:3002/api/voice/transcribe-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Audio,
          languageCode: languageCode,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setTranscript(result.transcription);
      } else {
        console.error("Transcription error:", result.error);
      }
    } catch (error) {
      console.error("Error sending audio to backend:", error);
    }
  };
  
  // Start recording using MediaRecorder API
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      // Clear previous audio chunks
      audioChunksRef.current = [];

      // Push data chunks as they come in
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      // When recording stops, process the audio
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        try {
          const base64Data = await readBlobAsBase64(audioBlob);
          // Remove the prefix "data:audio/wav;base64," if present
          const base64Audio = base64Data.split("base64,")[1];
          // Send the Base64 audio to the backend with the language code 'hi-IN'
          transcribeVoice(base64Audio, "hi-IN");
        } catch (error) {
          console.error("Error converting audio to Base64:", error);
        }
      };

      // Start the recorder
      mediaRecorderRef.current.start();
      console.log("Recording started...");

      // Automatically stop recording after 5 seconds (adjust if needed)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          console.log("Recording stopped automatically after 5 seconds");
        }
      }, 5000);
    } catch (error) {
      console.error("Error starting recording:", error);
    }
  };

  return (
    <div>
      {/* One button to start recording; no stop button needed */}
      <button onClick={startRecording}>Start Recording</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default TranscribeSpeech;
