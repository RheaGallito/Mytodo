import { useState, useEffect } from "react";
import VoiceCommand from "./VoiceCommand"; // fixed import path
import "../App.css";

function TaskForm({ onAddTask, categories, editTask, onUpdateTask, onCancelEdit, onAddCategory }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title);
      setDescription(editTask.description || "");
      setCategory(editTask.category);
      setPriority(editTask.priority);
      setDueDate(editTask.dueDate ? editTask.dueDate.split("T")[0] : "");
    } else {
      resetForm();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(categories.length > 0 ? categories[0] : "");
    setPriority("medium");
    setDueDate("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    const taskData = {
      title: title.trim(),
      description,
      category,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
    };

    editTask ? onUpdateTask({ ...taskData, id: editTask.id, completed: editTask.completed, createdAt: editTask.createdAt }) : onAddTask(taskData);
    !editTask && resetForm();
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory("");
      setShowCategoryInput(false);
    }
  };

  const handleVoiceCommand = (transcript) => {
    const parts = transcript.toLowerCase().split(" ");
    if (parts.includes("task")) {
      const titleStart = parts.indexOf("task") + 1;
      const titleEnd = parts.includes("priority") ? parts.indexOf("priority") :
        parts.includes("category") ? parts.indexOf("category") :
          parts.length;
      const title = parts.slice(titleStart, titleEnd).join(" ");
      setTitle(title.charAt(0).toUpperCase() + title.slice(1));

      if (parts.includes("priority")) {
        const priority = parts[parts.indexOf("priority") + 1];
        if (["high", "medium", "low"].includes(priority)) {
          setPriority(priority);
        }
      }

      if (parts.includes("category")) {
        const cat = parts[parts.indexOf("category") + 1];
        const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
        if (categories.includes(formattedCat)) {
          setCategory(formattedCat);
        }
      }
    }
  };

  return (
    <div className="task-form-container">
      <h3>{editTask ? "Edit Task" : "Add New Task"}</h3>

      {error && <div className="form-error">{error}</div>}

      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional)</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add details about this task"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category</label>
            {showCategoryInput ? (
              <div className="category-input-group">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="New category name"
                />
                <button type="button" className="add-btn" onClick={handleAddCategory}>Add</button>
                <button type="button" className="cancel-btn" onClick={() => setShowCategoryInput(false)}>Cancel</button>
              </div>
            ) : (
              <div className="select-container">
                <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <button type="button" className="new-category-btn" onClick={() => setShowCategoryInput(true)}>+ New</button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date (optional)</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
          />
        </div>

        <VoiceCommand onVoiceCommand={handleVoiceCommand} />

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editTask ? "Update Task" : "Add Task"}
          </button>
          {editTask && (
            <button type="button" className="cancel-btn" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TaskForm;
