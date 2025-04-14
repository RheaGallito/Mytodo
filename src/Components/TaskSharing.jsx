// TaskSharing.jsx
import { useState } from "react";
import "../App.css";

function TaskSharing({ tasks, categories, userId }) {
  const [shareLink, setShareLink] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const generateShareLink = async () => {
    setIsLoading(true);
    setError("");
    try {
      // In a real app, you would send this to your backend
      const dataToShare = {
        tasks,
        categories,
        userId,
        createdAt: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you'd get a shareable link from the server
      const fakeShareId = `share_${Date.now()}`;
      const fakeShareLink = `${window.location.origin}/shared/${fakeShareId}`;
      
      // Store locally for demo purposes
      localStorage.setItem(`shared_${fakeShareId}`, JSON.stringify(dataToShare));
      
      setShareLink(fakeShareLink);
    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Failed to generate share link");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="task-sharing">
      <h3>Share Your Tasks</h3>
      <button 
        className="share-btn"
        onClick={generateShareLink}
        disabled={isLoading}
      >
        {isLoading ? "Generating..." : "Generate Share Link"}
      </button>
      
      {error && <div className="share-error">{error}</div>}
      
      {shareLink && (
        <div className="share-link-container">
          <input
            type="text"
            value={shareLink}
            readOnly
            className="share-link-input"
          />
          <button 
            className="copy-btn"
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

export default TaskSharing;