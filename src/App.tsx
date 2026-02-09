import { useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import SettingsPage from "./pages/SettingsPage";
import { useAuth } from "./context/AuthContext";
import { db } from "./firebase";

const getInitialTheme = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "dark") {
    return true;
  }
  if (storedTheme === "light") {
    return false;
  }

  if (window.matchMedia) {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }

  return false;
};

function App() {
  const [isDark, setIsDark] = useState<boolean>(getInitialTheme);
  const [themeReady, setThemeReady] = useState(false);
  const { user, logout } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const loadTheme = async () => {
      if (!user) {
        if (isMounted) {
          setThemeReady(true);
        }
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const data = snapshot.data() as { themePreference?: string };
          if (data.themePreference === "dark") {
            setIsDark(true);
          } else if (data.themePreference === "light") {
            setIsDark(false);
          }
        }
      } finally {
        if (isMounted) {
          setThemeReady(true);
        }
      }
    };

    setThemeReady(false);
    void loadTheme();

    return () => {
      isMounted = false;
    };
  }, [user]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", isDark ? "dark" : "light");

    if (themeReady && user) {
      void setDoc(
        doc(db, "users", user.uid),
        {
          email: user.email ?? "",
          themePreference: isDark ? "dark" : "light",
        },
        { merge: true }
      );
    }
  }, [isDark, themeReady, user]);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200/80 bg-white/70 backdrop-blur dark:border-slate-800/80 dark:bg-slate-950/70">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link
            to="/"
            className="text-lg font-semibold text-slate-900 transition hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:text-slate-100 dark:hover:text-white"
          >
            Random Quotes
          </Link>
          <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
            <Link
              to="/"
              className="text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:text-slate-300 dark:hover:text-white"
            >
              Home
            </Link>
            {user ? (
              <>
                <Link
                  to="/settings"
                  className="text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:text-slate-300 dark:hover:text-white"
                >
                  Settings
                </Link>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Signed in as {user.email}
                </span>
              </>
            ) : (
              <Link
                to="/auth"
                className="text-slate-600 transition hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:text-slate-300 dark:hover:text-white"
              >
                Login / Sign Up
              </Link>
            )}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Logout
              </button>
            ) : null}
            <button
              type="button"
              onClick={toggleTheme}
              aria-pressed={isDark}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-400 dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            >
              Theme: {isDark ? "Dark" : "Light"}
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
