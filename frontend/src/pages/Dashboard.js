import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import Spinner from "../components/spinner";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2>Task Manager</h2>
        <button 
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            backgroundColor: "#e74c3c",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600"
          }}
        >
          Logout
        </button>
      </div>

      {loading && <Spinner />}

      <TaskForm
        refresh={fetchTasks}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        setLoading={setLoading}
      />

      <TaskList
        tasks={tasks}
        refresh={fetchTasks}
        setEditingTask={setEditingTask}
        setLoading={setLoading}
      />
    </div>
  );
}

export default Dashboard;
