import { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import "../App.css";

// Renamed to avoid conflict with component name
// eslint-disable-next-line react-refresh/only-export-components
export const layoutOptions = {
  list: {
    name: "List View",
    icon: "☰",
    className: "layout-list",
    ariaLabel: "Switch to list view"
  },
  grid: {
    name: "Grid View",
    icon: "⧉",
    className: "layout-grid",
    ariaLabel: "Switch to grid view"
  },
  compact: {
    name: "Compact View",
    icon: "≡",
    className: "layout-compact",
    ariaLabel: "Switch to compact view"
  }
};

const LayoutSelector = memo(({ currentLayout, onChangeLayout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleLayoutChange = useCallback((layout) => {
    onChangeLayout(layout);
    setIsOpen(false);
  }, [onChangeLayout]);

  const handleKeyDown = useCallback((e, layout) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLayoutChange(layout);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [handleLayoutChange]);

  return (
    <div className="layout-selector">
      <button 
        className="layout-btn"
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Change layout view"
      >
        {layoutOptions[currentLayout].icon} {layoutOptions[currentLayout].name}
      </button>
      
      {isOpen && (
        <div 
          className="layout-dropdown"
          role="menu"
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        >
          {Object.entries(layoutOptions).map(([layoutKey, layout]) => (
            <button
              key={layoutKey}
              role="menuitem"
              className={`layout-option ${currentLayout === layoutKey ? "active" : ""}`}
              onClick={() => handleLayoutChange(layoutKey)}
              onKeyDown={(e) => handleKeyDown(e, layoutKey)}
              aria-label={layout.ariaLabel}
              tabIndex={0}
            >
              {layout.icon} {layout.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
});

LayoutSelector.propTypes = {
  currentLayout: PropTypes.oneOf(Object.keys(layoutOptions)).isRequired,
  onChangeLayout: PropTypes.func.isRequired
};

export default LayoutSelector;
