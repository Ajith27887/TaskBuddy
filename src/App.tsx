import React from "react";
import "./App.css";
import { useLocation } from "react-router";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import Login from "./Components/Login/Login";
import TaskNav from "./Components/TaskList/TaskNav";
import TaskListView from "./Components/TaskList/TaskListView";
import { AuthProvider } from "./Components/AuthContext/AuthContext.tsx";
import TaskBoardView from "./Components/TaskList/TaskBoardView.js";
import { TaskProvider } from "./Components/TaskContext/TaskContext.tsx";
import CreateTask from "./Components/TaskList/CreateTask.js";

function App() {
  return (
    <Router>
      <AuthProvider>
        <TaskProvider>
          <AppContent />
        </TaskProvider>
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname !== "/login" && <TaskNav />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/list-view" element={<TaskListView />} />
        <Route path="/board-view" element={<TaskBoardView />} />
        <Route path="/popup" element={<CreateTask />}></Route>
      </Routes>
      <CreateTask />
    </div>
  );
}

export default App;
