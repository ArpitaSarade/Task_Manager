import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // TASKS
  // =========================
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // FORM
  // =========================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  // =========================
  // EDIT MODE
  // =========================
  const [editingTaskId, setEditingTaskId] = useState(null);

  // =========================
  // SEARCH & FILTER
  // =========================
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =========================
  // FETCH TASKS
  // =========================
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/tasks");

      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error("Get tasks error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load tasks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setPriority("medium");
    setDueDate("");
    setEditingTaskId(null);
  };

  // =========================
  // CREATE TASK
  // =========================
  const createTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const response = await API.post("/tasks", {
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: dueDate || undefined,
      });

      alert(
        response.data.message ||
          "Task created successfully"
      );

      resetForm();
      await fetchTasks();

    } catch (error) {
      console.error("Create task error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to create task"
      );
    }
  };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (task) => {
    setEditingTaskId(task._id);

    setTitle(task.title || "");
    setDescription(task.description || "");
    setStatus(task.status || "pending");
    setPriority(task.priority || "medium");

    if (task.dueDate) {
      setDueDate(
        new Date(task.dueDate)
          .toISOString()
          .split("T")[0]
      );
    } else {
      setDueDate("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // UPDATE TASK
  // =========================
  const updateTask = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter task title");
      return;
    }

    try {
      const response = await API.put(
        `/tasks/${editingTaskId}`,
        {
          title: title.trim(),
          description: description.trim(),
          status,
          priority,
          dueDate: dueDate || undefined,
        }
      );

      alert(
        response.data.message ||
          "Task updated successfully"
      );

      resetForm();
      await fetchTasks();

    } catch (error) {
      console.error("Update task error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to update task"
      );
    }
  };

  // =========================
  // DELETE TASK
  // =========================
  const deleteTask = async (taskId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await API.delete(
        `/tasks/${taskId}`
      );

      alert(
        response.data.message ||
          "Task deleted successfully"
      );

      if (editingTaskId === taskId) {
        resetForm();
      }

      await fetchTasks();

    } catch (error) {
      console.error("Delete task error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete task"
      );
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // =========================
  // STATISTICS
  // =========================
  const totalTasks = tasks.length;

  const pendingTasks = tasks.filter(
    (task) => task.status === "pending"
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress"
  ).length;

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  // =========================
  // SEARCH + FILTER
  // =========================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      task.description
        ?.toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      task.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // =========================
  // STATUS TEXT
  // =========================
  const getStatusText = (status) => {
    if (status === "pending") return "Pending";
    if (status === "in-progress")
      return "In Progress";
    if (status === "completed")
      return "Completed";

    return status;
  };

  // =========================
  // PRIORITY TEXT
  // =========================
  const getPriorityText = (priority) => {
    return (
      priority.charAt(0).toUpperCase() +
      priority.slice(1)
    );
  };

  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}
      <header className="dashboard-header">

        <div>
          <h1>Task Manager</h1>

          <p>
            Organize your work and stay productive.
          </p>
        </div>

        <button
          className="logout-btn"
          onClick={logout}
        >
          Logout
        </button>

      </header>

      <main className="dashboard-container">

        {/* =========================
            STATISTICS
        ========================= */}
<section className="stats-grid">

  <div className="stat-card total">
    <div className="stat-icon">📋</div>

    <div>
      <span>Total Tasks</span>
      <h2>{totalTasks}</h2>
    </div>
  </div>

  <div className="stat-card pending">
    <div className="stat-icon">⏳</div>

    <div>
      <span>Pending</span>
      <h2>{pendingTasks}</h2>
    </div>
  </div>

  <div className="stat-card progress">
    <div className="stat-icon">🔄</div>

    <div>
      <span>In Progress</span>
      <h2>{inProgressTasks}</h2>
    </div>
  </div>

  <div className="stat-card completed">
    <div className="stat-icon">✅</div>

    <div>
      <span>Completed</span>
      <h2>{completedTasks}</h2>
    </div>
  </div>

</section>

        {/* =========================
            CREATE / UPDATE FORM
        ========================= */}
        <section className="task-form-card">

          <div className="section-heading">

            <div>
              <h2>
                {editingTaskId
                  ? "Update Task"
                  : "Create New Task"}
              </h2>

              <p>
                {editingTaskId
                  ? "Update the selected task."
                  : "Add a new task to your list."}
              </p>
            </div>

          </div>

          <form
            onSubmit={
              editingTaskId
                ? updateTask
                : createTask
            }
          >

            <div className="form-row">

              <div className="form-group">

                <label>Task Title *</label>

                <input
                  type="text"
                  placeholder="Enter task title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

              </div>

              <div className="form-group">

                <label>Due Date</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) =>
                    setDueDate(e.target.value)
                  }
                />

              </div>

            </div>

            <div className="form-group">

              <label>Description</label>

              <textarea
                rows="3"
                placeholder="Enter task description"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

            <div className="form-row">

              <div className="form-group">

                <label>Status</label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value)
                  }
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="in-progress">
                    In Progress
                  </option>

                  <option value="completed">
                    Completed
                  </option>
                </select>

              </div>

              <div className="form-group">

                <label>Priority</label>

                <select
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value)
                  }
                >
                  <option value="low">
                    Low
                  </option>

                  <option value="medium">
                    Medium
                  </option>

                  <option value="high">
                    High
                  </option>
                </select>

              </div>

            </div>

            <div className="form-actions">

              <button
                type="submit"
                className="primary-btn"
              >
                {editingTaskId
                  ? "Update Task"
                  : "Create Task"}
              </button>

              {editingTaskId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* =========================
            TASK LIST HEADER
        ========================= */}
        <section className="tasks-section">

          <div className="tasks-header">

            <div>
              <h2>My Tasks</h2>

              <p>
                {filteredTasks.length} task
                {filteredTasks.length !== 1
                  ? "s"
                  : ""}{" "}
                shown
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={fetchTasks}
            >
              ↻ Refresh
            </button>

          </div>

          {/* =========================
              SEARCH + FILTER
          ========================= */}
          <div className="filter-bar">

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="in-progress">
                In Progress
              </option>

              <option value="completed">
                Completed
              </option>
            </select>

          </div>

          {/* =========================
              LOADING
          ========================= */}
          {loading && (
            <div className="message-box">
              Loading tasks...
            </div>
          )}

          {/* =========================
              ERROR
          ========================= */}
          {!loading && error && (
            <div className="error-box">
              {error}
            </div>
          )}

          {/* =========================
              NO TASKS
          ========================= */}
          {!loading &&
            !error &&
            filteredTasks.length === 0 && (
              <div className="empty-box">
                <div className="empty-icon">
                  📋
                </div>

                <h3>No tasks found</h3>

                <p>
                  Create a new task or change your
                  search/filter.
                </p>
              </div>
            )}

          {/* =========================
              TASK CARDS
          ========================= */}
          {!loading &&
            !error &&
            filteredTasks.length > 0 && (
              <div className="tasks-grid">

                {filteredTasks.map((task) => (

                  <div
                    className="task-card"
                    key={task._id}
                  >

                    <div className="task-card-top">

                      <span
                        className={`priority-badge ${task.priority}`}
                      >
                        {getPriorityText(
                          task.priority
                        )}
                      </span>

                      <span
                        className={`status-badge ${task.status}`}
                      >
                        {getStatusText(
                          task.status
                        )}
                      </span>

                    </div>

                    <h3>
                      {task.title}
                    </h3>

                    <p className="task-description">
                      {task.description ||
                        "No description provided."}
                    </p>

                    {task.dueDate && (
                      <div className="due-date">
                        📅{" "}
                        {new Date(
                          task.dueDate
                        ).toLocaleDateString()}
                      </div>
                    )}

                    <div className="task-actions">

                      <button
                        className="edit-btn"
                        onClick={() =>
                          startEdit(task)
                        }
                      >
                        ✏️ Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          deleteTask(task._id)
                        }
                      >
                        🗑️ Delete
                      </button>

                    </div>

                  </div>

                ))}

              </div>
            )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;