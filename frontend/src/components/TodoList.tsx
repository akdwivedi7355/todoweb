import React, { useEffect, useState } from "react";
import { CheckCircle, Circle, Trash2, Plus } from "lucide-react";
import { getTodos, updateTodo, deleteTodo, createTodo } from "../services/api";
import { Todo } from "../types";
import { useAuthStore } from "../store/authStore";

export const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({ title: "", description: "" });
  const [isAdding, setIsAdding] = useState(false);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const isAdmin = useAuthStore((state) => state.isAdmin());
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleToggle = async (todo: Todo) => {
    try {
      await updateTodo(todo.TodoID, { completed: !todo.Completed });
      fetchTodos();
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const assignedUserID =
        isAdmin && selectedUser ? selectedUser : user?.UserID;
      await createTodo({ ...newTodo, UserID: assignedUserID });
      setNewTodo({ title: "", description: "" });
      setIsAdding(false);
      fetchTodos();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const filteredTodos = isAdmin
    ? todos.filter((todo) =>
        selectedUser ? todo.UserID === selectedUser : true
      )
    : todos.filter((todo) => todo.UserID === user?.UserID);

  return (
    <div className="min-h-screen bg-gray-900 py-8 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">
              {isAdmin
                ? selectedUser
                  ? `User ${selectedUser} Tasks`
                  : "All Tasks"
                : "My Tasks"}
            </h2>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </button>
          </div>

          {isAdmin && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Filter by User:</h3>
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="px-3 py-1 bg-gray-600 rounded"
                >
                  All
                </button>
                {[...new Set(todos.map((t) => t.UserID))].map((id) => (
                  <button
                    key={id}
                    onClick={() => setSelectedUser(id)}
                    className={`px-3 py-1 rounded ${
                      selectedUser === id
                        ? "bg-blue-500 text-white"
                        : "bg-gray-600"
                    }`}
                  >
                    {id}
                  </button>
                ))}
              </div>
            </div>
          )}
          {isAdding && (
            <form
              onSubmit={handleAdd}
              className="mb-6 p-4 bg-gray-700 rounded-md"
            >
              <div className="space-y-4">
                {isAdmin && (
                  <select
                    value={selectedUser || ""}
                    onChange={(e) => setSelectedUser(Number(e.target.value))}
                    className="w-full p-2 border rounded bg-gray-600 text-white"
                  >
                    <option value="">Select User</option>
                    {[...new Set(todos.map((t) => t.UserID))].map((id) => (
                      <option key={id} value={id}>
                        {id}
                      </option>
                    ))}
                  </select>
                )}
                <input
                  type="text"
                  value={newTodo.title}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, title: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-600 text-white"
                  placeholder="Title"
                  required
                />
                <textarea
                  value={newTodo.description}
                  onChange={(e) =>
                    setNewTodo({ ...newTodo, description: e.target.value })
                  }
                  className="w-full p-2 border rounded bg-gray-600 text-white"
                  placeholder="Description"
                  required
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setIsAdding(false)}
                    className="px-4 py-2 bg-gray-500 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {filteredTodos.map((todo) => (
              <div
                key={todo.TodoID}
                className="flex justify-between p-4 bg-gray-700 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggle(todo)}
                    className={`px-3 py-1 text-white font-semibold rounded ${
                      todo.Completed ? "bg-green-600" : "bg-red-600"
                    }`}
                  >
                    {todo.Completed ? "Completed" : "Not Complete"}
                  </button>
                  <div>
                    <h3
                      className={`text-lg font-medium ${
                        todo.Completed
                          ? "line-through text-gray-400"
                          : "text-white"
                      }`}
                    >
                      {todo.Title}
                    </h3>
                    <p className="text-gray-300 mt-1">{todo.Description}</p>
                    {isAdmin && (
                      <p className="text-sm text-gray-400 mt-1">
                        User ID: {todo.UserID}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo.TodoID)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
