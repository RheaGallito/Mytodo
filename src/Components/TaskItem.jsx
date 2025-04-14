import { useState } from "react";
import "../App.css";
import TimeTracker from "./TimeTracker";

function TaskItem({ task, onDelete, onToggleComplete, onEdit, onArchive, onUnarchive }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Not specified";
    const options = { 
      year: "numeric", 
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isOverdue = () => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case "high": return "priority-high";
      case "medium": return "priority-medium";
      case "low": return "priority-low";
      default: return "";
    }
  };

  return (
    <div className={`task-item ${task.completed ? "completed" : ""} ${isOverdue() ? "overdue" : ""} ${task.archived ? "archived" : ""}`}>
      <div className="task-header">
        <div className="task-title-group">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="task-checkbox"
            disabled={task.archived}
          />
          <h3 className="task-title">
            {task.title}
            {task.archived && <span className="archived-badge">Archived</span>}
            <span className={`priority-badge ${getPriorityClass()}`}>
              {task.priority}
            </span>
          </h3>
        </div>

        <div className="task-actions">
          {!task.archived ? (
            <>
              <button 
                className="task-btn archive-btn" 
                onClick={() => onArchive(task.id)}
              >
                Archive
              </button>
              <button 
                className="task-btn expand-btn" 
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Hide" : "Details"}
              </button>
              <button 
                className="task-btn edit-btn" 
                onClick={() => onEdit(task)}
              >
                Edit
              </button>
              <button 
                className="task-btn delete-btn" 
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </>
          ) : (
            <>
              <button 
                className="task-btn unarchive-btn" 
                onClick={() => onUnarchive(task.id)}
              >
                Unarchive
              </button>
              <button 
                className="task-btn delete-btn" 
                onClick={() => onDelete(task.id)}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {expanded && (
        <div className="task-details">
          <div className="detail-row">
            <span className="detail-label">Description:</span>
            <span className="detail-value">{task.description || "No description"}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Category:</span>
            <span className="detail-value">{task.category || "Uncategorized"}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Priority:</span>
            <span className={`detail-value ${getPriorityClass()}`}>
              {task.priority || "Not specified"}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Due Date:</span>
            <span className={`detail-value ${isOverdue() ? "overdue-text" : ""}`}>
              {formatDate(task.dueDate)}
              {isOverdue() && !task.completed && <span className="overdue-indicator"> (Overdue)</span>}
            </span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Created:</span>
            <span className="detail-value">{formatDateTime(task.createdAt)}</span>
          </div>
          
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className="detail-value">
              {task.completed 
                ? `Completed on ${formatDateTime(task.completedAt)}` 
                : "Pending"}
            </span>
          </div>
          
          {!task.archived && (
            <div className="detail-row">
              <span className="detail-label">Time Tracking:</span>
              <TimeTracker taskId={task.id} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default TaskItem;