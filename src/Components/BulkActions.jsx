import React, { useState } from "react";

function BulkActions({
  selectedTasks,
  onDeleteSelected,
  onCompleteSelected,
  onArchiveSelected,
}) {
  // State to show loading or action states
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    await onCompleteSelected();
    setLoading(false);
  };

  const handleArchive = async () => {
    setLoading(true);
    await onArchiveSelected();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await onDeleteSelected();
    setLoading(false);
  };

  if (selectedTasks.length === 0) return null;

  return (
    <div className="bulk-actions">
      <div className="bulk-actions-info">
        {selectedTasks.length} task(s) selected
      </div>
      <div className="bulk-actions-buttons">
        <button
          className="bulk-btn complete-btn"
          onClick={handleComplete}
          disabled={loading}
        >
          {loading ? "Processing..." : "Mark Complete"}
        </button>
        <button
          className="bulk-btn archive-btn"
          onClick={handleArchive}
          disabled={loading}
        >
          {loading ? "Processing..." : "Archive"}
        </button>
        <button
          className="bulk-btn delete-btn"
          onClick={handleDelete}
          disabled={loading}
        >
          {loading ? "Processing..." : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default BulkActions;
