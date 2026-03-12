import { useEffect, useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

function TaskForm({ refresh, editingTask, setEditingTask, setLoading }) {

  const [form, setForm] = useState({
    title: "",
    description: ""
  });

  useEffect(() => {
    if (editingTask) {
      setForm({
        title: editingTask.title,
        description: editingTask.description
      });
    }
  }, [editingTask]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (editingTask) {
        await API.put(`/tasks/${editingTask.id}`, form);
        toast.success("Task updated successfully");
        setEditingTask(null);
      } else {
        await API.post("/tasks", form);
        toast.success("Task added successfully");
      }

      setForm({ title: "", description: "" });
      refresh();

    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
    setForm({ title: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) =>
          setForm({ ...form, title: e.target.value })
        }
        required
      />

      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        required
      />

      <div className="form-buttons">
        <button className="primary">
          {editingTask ? "Update Task" : "Add Task"}
        </button>

        {editingTask && (
          <button
            type="button"
            className="secondary"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
