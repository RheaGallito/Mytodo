import React, { useState } from "react";
import "../App.css";

function Archived({ archivedTasks, onDeleteArchived, onRestoreTask }) {
  const [expanded, setExpanded] = useState(true);

  const formatDate = (dateString) => {
    if (!dateString) return "No due date";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="archived-tasks">
      <div className="archived-header" onClick={() => setExpanded(!expanded)}>
        <h2>Archived Tasks ({archivedTasks.length})</h2>
        <span>{expanded ? "▲" : "▼"}</span>
      </div>
      
      {expanded && (
        <div className="archived-content">
          {archivedTasks.length === 0 ? (
            <p className="no-archived">No archived tasks</p>
          ) : (
            <ul className="archived-list">
              {archivedTasks.map((task) => (
                <li key={task.id} className="archived-item">
                  <div className="task-info">
                    <h3>
                      {task.title}
                      {task.completed && <span className="completed-badge">Completed</span>}
                    </h3>
                    {task.description && <p className="task-description">{task.description}</p>}
                    <div className="task-meta">
                      <span className={`priority ${task.priority}`}>
                        {task.priority}
                      </span>
                      <span className="category">{task.category}</span>
                      {task.dueDate && (
                        <span className="due-date">
                          Due: {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="task-actions">
                    <button 
                      className="restore-btn"
                      onClick={() => onRestoreTask(task.id)}
                    >
                      Restore
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => onDeleteArchived(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default Archived;