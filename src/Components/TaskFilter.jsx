import { useState } from "react";
import "../App.css";

function TaskFilter({ filters, categories, onFilterChange, onAddCategory }) {
  const [showFilters, setShowFilters] = useState(false);
  const [newCategory, setNewCategory] = useState("");

  const handleFilterChange = (filterType, value) => {
    onFilterChange({ [filterType]: value });
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory("");
    }
  };

  const renderFilterButtons = (filterType, options) => {
    return options.map((option) => (
      <button
        key={option}
        className={`filter-btn ${filters[filterType] === option ? "active" : ""}`}
        onClick={() => handleFilterChange(filterType, option)}
      >
        {option.charAt(0).toUpperCase() + option.slice(1)}
      </button>
    ));
  };

  return (
    <div className="filters-container">
      <div className="filters-header">
        <button
          className="toggle-filters-btn"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>

        <div className="quick-filters">
          {renderFilterButtons("status", ["all", "active", "completed"])}
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <h4>Category</h4>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <form onSubmit={handleAddCategory} className="add-category-form">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                />
                <button type="submit" className="add-btn">
                  Add
                </button>
              </form>
            </div>

            <div className="filter-group">
              <h4>Priority</h4>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange("priority", e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange("sortBy", e.target.value)}
              >
                <option value="date">Date Created</option>
                <option value="dueDate">Due Date</option>
                <option value="priority">Priority</option>
                <option value="title">Title</option>
              </select>
            </div>

            <div className="filter-group">
              <h4>Sort Order</h4>
              <select
                value={filters.sortOrder}
                onChange={(e) => handleFilterChange("sortOrder", e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskFilter;
