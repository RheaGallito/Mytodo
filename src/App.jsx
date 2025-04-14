import { useState, useEffect } from "react";
import Login from "./Components/Login";
import SignUp from "./Components/SignUp";
import TodoList from "./Components/TodoList";
import "./App.css";

import { LanguageSelector, translations } from "./Components/LanguageSelector";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    const savedUser = localStorage.getItem("todoUser");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }

    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      setDarkMode(JSON.parse(savedTheme));
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("todoUser", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("todoUser");
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <header className="app-header">
        <h1>
          <img
            src="src/assets/logo.png"
            alt=""
            srcset=""
            width={40}
            height={40}
          />{" "}
          Task Master
        </h1>

        <div className="header-controls">
          <LanguageSelector
            currentLanguage={currentLanguage}
            onChangeLanguage={setCurrentLanguage}
          />
          {user && (
            <>
              <span className="user-greeting">
                {translations[currentLanguage].hello}, {user.username}
              </span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>
      </header>

      <main className="app-main">
        {user ? (
          <TodoList user={user} />
        ) : showSignUp ? (
          <SignUp
            onSignUp={handleLogin}
            switchToLogin={() => setShowSignUp(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            switchToSignUp={() => setShowSignUp(true)}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>Task Master &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}

export default App;
