// VoiceCommand.jsx
import { useState, useEffect, useRef } from "react";
import "../App.css";

function VoiceCommand({ onVoiceCommand }) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      setError("Voice commands not supported in your browser");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      onVoiceCommand(transcript);
    };

    recognition.onerror = (event) => {
      setError(`Error occurred: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [onVoiceCommand]);

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (error) {
    return <div className="voice-error">{error}</div>;
  }

  return (
    <div className="voice-command">
      <button
        className={`voice-btn ${isListening ? "listening" : ""}`}
        onClick={toggleListening}
      >
        {isListening ? "Stop Listening" : "Voice Command"}
      </button>
      {transcript && <div className="voice-transcript">"{transcript}"</div>}
    </div>
  );
}

export default VoiceCommand;
