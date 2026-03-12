import API from "../services/api";
import { toast } from "react-toastify";

function TaskList({ tasks, refresh, setEditingTask, setLoading }) {

  const deleteTask = async (id) => {
    try {
      setLoading(true);
      await API.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully");
      refresh();
    } catch (err) {
      toast.error("Failed to delete task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="task-item">

          <div className="task-content">
            <h4>{task.title}</h4>
            <p>{task.description}</p>
          </div>

          <div className="task-actions">
            <button
              className="update-btn"
              onClick={() => setEditingTask(task)}
            >
              Update
            </button>

            <button
              className="danger"
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>

        </div>
      ))}
    </div>
  );
}

export default TaskList;
