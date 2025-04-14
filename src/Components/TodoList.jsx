import { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TaskFilters from "./TaskFilter";
import BulkActions from "./BulkActions"; // Ensure correct import path
import DraggableTaskList from "./DraggableTaskList";
import TaskSharing from "./TaskSharing";
import LayoutSelector from "./LayOutSelector";
import Archived from "./Archived";
import "../App.css";

function TodoList({ user }) {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [categories, setCategories] = useState(["Work", "Personal", "Shopping", "Health"]);
  const [editTask, setEditTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all",
    sortBy: "date",
    sortOrder: "desc",
  });
  const [notification, setNotification] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [currentLayout, setCurrentLayout] = useState("list");
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem(`tasks_${user.id}`)) || [];
    const savedCategories = JSON.parse(localStorage.getItem(`categories_${user.id}`)) || [];
    setTasks(savedTasks);
    setCategories(savedCategories.length ? savedCategories : ["Work", "Personal", "Shopping", "Health"]);
  }, [user.id]);

  useEffect(() => {
    localStorage.setItem(`tasks_${user.id}`, JSON.stringify(tasks));
    localStorage.setItem(`categories_${user.id}`, JSON.stringify(categories));
    applyFilters();
    checkDueTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tasks, filters, categories, user.id, showArchived]);

  const checkDueTasks = () => {
    const now = new Date();
    const dueSoon = tasks.filter((task) => {
      if (!task.dueDate || task.completed) return false;
      const timeDiff = new Date(task.dueDate) - now;
      return timeDiff > 0 && timeDiff <= 24 * 60 * 60 * 1000;
    });

    if (dueSoon.length) {
      showNotification(`You have ${dueSoon.length} task(s) due in the next 24 hours!`, "warning");
    }
  };

  const applyFilters = () => {
    let result = [...tasks];

    if (!showArchived) {
      result = result.filter((task) => !task.archived);
    }

    if (filters.status !== "all") {
      result = result.filter((task) =>
        filters.status === "completed" ? task.completed : !task.completed
      );
    }

    if (filters.category !== "all") {
      result = result.filter((task) => task.category === filters.category);
    }

    if (filters.priority !== "all") {
      result = result.filter((task) => task.priority === filters.priority);
    }

    result.sort((a, b) => {
      let compare = 0;
      switch (filters.sortBy) {
        case "title":
          compare = a.title.localeCompare(b.title);
          break;
        case "priority":
          { const priorityMap = { high: 3, medium: 2, low: 1 };
          compare = priorityMap[b.priority] - priorityMap[a.priority];
          break; }
        case "dueDate":
          compare = new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity);
          break;
        default:
          compare = new Date(b.createdAt) - new Date(a.createdAt);
      }
      return filters.sortOrder === "asc" ? compare : -compare;
    });

    setFilteredTasks(result);
  };

  const showNotification = (message, type = "success", duration = 3000) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), duration);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      completed: false,
      archived: false,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
    showNotification("Task added successfully!");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    showNotification("Task deleted!", "danger");
  };

  const toggleComplete = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const updateTask = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditTask(null);
    showNotification("Task updated successfully!");
  };

  const addCategory = (category) => {
    if (category && !categories.includes(category)) {
      setCategories((prev) => [...prev, category]);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleArchiveTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, archived: true } : task
      )
    );
    showNotification("Task archived!");
  };

  const handleUnarchiveTask = (taskId) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, archived: false } : task
      )
    );
    showNotification("Task unarchived!");
  };

  const toggleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const deleteSelected = () => {
    setTasks((prev) => prev.filter((task) => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
    showNotification("Selected tasks deleted!", "danger");
  };

  const completeSelected = () => {
    setTasks((prev) =>
      prev.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, completed: true } : task
      )
    );
    setSelectedTasks([]);
    showNotification("Tasks marked as complete!");
  };

  const archiveSelected = () => {
    setTasks((prev) =>
      prev.map((task) =>
        selectedTasks.includes(task.id) ? { ...task, archived: true } : task
      )
    );
    setSelectedTasks([]);
    showNotification("Tasks archived!");
  };

  const handleReorder = (reorderedTasks) => {
    setTasks(reorderedTasks);
  };

  return (
    <div className="todo-container">
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.message}
          <button className="close-btn" onClick={() => setNotification(null)}>
            ×
          </button>
        </div>
      )}

      <div className="todo-header">
        <h2>My Tasks</h2>
        <div className="task-count">
          {filteredTasks.filter((t) => !t.completed).length} tasks remaining
        </div>
      </div>

      <LayoutSelector
        currentLayout={currentLayout}
        onChangeLayout={setCurrentLayout}
      />

      <TaskFilters
        filters={filters}
        categories={categories}
        onFilterChange={updateFilters}
        onAddCategory={addCategory}
      />

      <TaskForm
        onAddTask={addTask}
        categories={categories}
        editTask={editTask}
        onUpdateTask={updateTask}
        onCancelEdit={() => setEditTask(null)}
        onAddCategory={addCategory}
      />

      <BulkActions
        selectedTasks={selectedTasks}
        onDeleteSelected={deleteSelected}
        onCompleteSelected={completeSelected}
        onArchiveSelected={archiveSelected}
      />

      <button
        className="toggle-archived-btn"
        onClick={() => setShowArchived(!showArchived)}
      >
        {showArchived ? "Hide Archived" : "Show Archived"}
      </button>

      {showArchived && (
        <Archived
          archivedTasks={tasks.filter((task) => task.archived)}
          onDeleteArchived={deleteTask}
          onRestoreTask={handleUnarchiveTask}
        />
      )}

      <div className={`tasks-container ${currentLayout}`}>
        {filteredTasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Add a new task to get started!</p>
          </div>
        ) : (
          <DraggableTaskList
            tasks={filteredTasks}
            onDelete={deleteTask}
            onToggleComplete={toggleComplete}
            onEdit={setEditTask}
            onReorder={handleReorder}
            onSelect={toggleTaskSelection}
            isSelected={(taskId) => selectedTasks.includes(taskId)}
            onArchive={handleArchiveTask}
            onUnarchive={handleUnarchiveTask}
          />
        )}
      </div>

      <TaskSharing tasks={tasks} categories={categories} userId={user.id} />
    </div>
  );
}

export default TodoList;
