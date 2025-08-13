"use client";

import { useState, useEffect } from "react";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";
import TrashIcon from "@heroicons/react/24/solid/TrashIcon";


export default function Home() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentTodo, setCurrentTodo] = useState(null);

  // 🔁 Load todos from backend on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const data = await res.json();
    setTodoList(data);
  };

  const addTodo = async () => {
    if (title !== "" || description !== "") {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      const newTodo = await res.json();
      setTodoList((prev) => [...prev, newTodo]);
      setTitle("");
      setDescription("");
    }
  };

  const clearAllTodos = async () => {
    await fetch("/api/todos", { method: "DELETE" });
    setTodoList([]);
  };

  // NEW: Delete todo function
  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodoList(todoList.filter((todo) => todo.id !== id));
  };

  // ...existing code...

const updateTodo = async () => {
  if (!currentTodo) return;
  const res = await fetch(`/api/todos/${currentTodo.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  const updatedTodo = await res.json();
  setTodoList((prev) =>
    prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
  );
  setCurrentTodo(null);
  setTitle("");
  setDescription("");
};

const toggleTodoStatus = async (id, newStatus) => {
  const res = await fetch(`/api/todos/${id}`, {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ completed: newStatus }),
  });

  if (!res.ok) {
    console.error("Failed to update todo:", res.status);
    return;
  }
  const updatedTodo = await res.json();
  setTodoList((prev) =>
    prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
  );
};

  return (
    <div className="flex flex-col h-screen w-full justify-center items-center bg-gray-50 p-6">
      <div className="flex flex-col border rounded-lg shadow-lg w-full max-w-4xl p-6 space-y-6 bg-white">
        {/* 📝 Title */}
        <h1 className="text-3xl font-bold text-center text-gray-900 tracking-tight"
            style={{ fontFamily: "Arial, sans-serif" }}>
          📝 Todo List ({todoList.length})
        </h1>
        <p className="text-sm text-center text-gray-600 italic">
          Track your goals. Make progress daily.
        </p>
        {/* Form */}
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 text-sm w-full sm:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md p-2 text-sm w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className="rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-1/4 transition"
            onClick={(e) => {
              e.preventDefault();
              currentTodo ? updateTodo() : addTodo();
            }}
          >
            {currentTodo ? "Update" : "Add"} Todo!
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-md">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-xs uppercase bg-gray-100 text-gray-600">
              <tr>
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((todo, index) => (
                <tr key={index} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 border-b transition">
                  <td className="py-3 px-6">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoStatus(todo.id, !todo.completed)}
                        className="mr-2 accent-blue-600"
                      />
                      {/* Causing error in toggle to do list so this won't work yet */}
                      <span className={todo.completed ? "line-through text-gray-400" : ""}>
                        {todo.title}
                      </span>

                    </label>
                  </td>
                  <td className="py-3 px-6">{todo.description}</td>
                  <td className="py-3 px-6">
                    <div className="flex space-x-4">
                      <button
                        className="flex items-center text-blue-600 hover:text-blue-900 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTodo(todo);
                          setTitle(todo.title);
                          setDescription(todo.description);
                        }}
                      >
                        <PencilIcon className="h-4 w-4 mr-1" />
                        Edit
                      </button>
                      <button
                        className="flex items-center text-red-500 hover:text-red-700 transition"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo.id);
                        }}
                      >
                        <TrashIcon className="h-4 w-4 mr-1" />
                        Del
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Clear All Button */}
        <button
          className="rounded-md px-4 py-2 w-full bg-red-600 hover:bg-red-700 text-white text-sm transition"
          onClick={(e) => {
            e.preventDefault();
            clearAllTodos();
          }}
        >
          Clear All Todos!
        </button>
      </div>
    </div>
  );
}
