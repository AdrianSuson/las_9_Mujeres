import { useEffect, useState, Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import ProtectedRoute from "./state/ProtectedRoute";
import { themeSettings } from "./theme";
import LoadingSpinner from "./state/loadind";
const Layout = lazy(() => import("./scenes/layout/layout"));
const Dashboard = lazy(() => import("./scenes/dashboard/dashboard"));
const Login = lazy(() => import("./scenes/login/login"));
const Income = lazy(() => import("./scenes/transactions/income"));
const Employees = lazy(() => import("./scenes/employees/employees"));
const Breakdown = lazy(() => import("./scenes/breakdown/breakdown"));
const Daily = lazy(() => import("./scenes/chart/Daily"));
const Monthly = lazy(() => import("./scenes/chart/monthly"));
const Sales = lazy(() => import("./scenes/transactions/sales"));
const Expenses = lazy(() => import("./scenes/transactions/expenses"));
const Storage = lazy(() => import("./scenes/Products/products"));
const POS = lazy(() => import("./scenes/POS/pos"));

function App() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [, setUsername] = useState("");
  const mode = "light";
  const theme = createTheme(themeSettings(mode));

  useEffect(() => {
    localStorage.setItem("isLoggedIn", loggedIn.toString());
  }, [loggedIn]);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route
                path="/admin"
                element={
                  <Login setLoggedIn={setLoggedIn} setUsername={setUsername} />
                }
              />
              <Route path="/" element={<POS />} />
              <Route element={<ProtectedRoute isLoggedIn={loggedIn} />}>
                <Route element={<Layout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/income" element={<Income />} />
                  <Route path="/sales" element={<Sales />} />
                  <Route path="/expenses" element={<Expenses />} />
                  <Route path="/employees" element={<Employees />} />
                  <Route path="/breakdown" element={<Breakdown />} />
                  <Route path="/daily" element={<Daily />} />
                  <Route path="/monthly" element={<Monthly />} />
                  <Route path="/products" element={<Storage />} />
                </Route>
              </Route>
            </Routes>
          </Suspense>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
