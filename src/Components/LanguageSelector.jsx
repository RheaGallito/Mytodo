// LanguageSelector.jsx
import { useState, UseEffect } from "react";
import "../App.css";

const translations = {
  en: {
    appTitle: "Task Master",
    hello: "Hello",
    logout: "Logout",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    // Add all other translations here
  },
  es: {
    appTitle: "Maestro de Tareas",
    hello: "Hola",
    logout: "Cerrar sesión",
    lightMode: "Modo claro",
    darkMode: "Modo oscuro",
    // Add all other translations here
  },
  // Add more languages as needed
};

function LanguageSelector({ currentLanguage, onChangeLanguage }) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="language-selector">
      <button 
        className="language-btn"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {currentLanguage.toUpperCase()}
      </button>
      {showDropdown && (
        <div className="language-dropdown">
          {Object.keys(translations).map((lang) => (
            <button
              key={lang}
              className="language-option"
              onClick={() => {
                onChangeLanguage(lang);
                setShowDropdown(false);
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export { LanguageSelector, translations };