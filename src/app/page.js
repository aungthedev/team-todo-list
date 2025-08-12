"use client";

import { useState, useEffect } from "react";

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

  return (
    <div className="flex flex-col h-screen w-screen justify-center items-center p-4">
      <div className="flex flex-col border rounded-md w-full max-w-3xl p-4 space-y-4">
        {/* Form */}
        <div className="flex flex-row space-x-2 w-full justify-between">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded-md p-2 text-sm w-1/4"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-md p-2 text-sm w-1/2"
          />
          <button
            className="rounded-md border p-2 bg-blue-600 text-white text-sm w-1/4 active:bg-blue-700"
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
            <thead className="text-xs uppercase bg-gray-100">
              <tr>
                <th className="py-3 px-6">Title</th>
                <th className="py-3 px-6">Description</th>
                <th className="py-3 px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {todoList.map((todo, index) => (
                <tr key={index} className="bg-white border-b">
                  <td className="py-3 px-6">{todo.title}</td>
                  <td className="py-3 px-6">{todo.description}</td>
                  <td className="py-3 px-6">
                    <div className="flex flex-row space-x-2">
                      <button
                        className="text-blue-600 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentTodo(todo);
                          setTitle(todo.title);
                          setDescription(todo.description);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 underline"
                        onClick={(e) => {
                          e.preventDefault();
                          deleteTodo(todo.id);
                        }}
                      >
                        Delete
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
          className="rounded-md border text-sm p-2 w-full bg-red-600 text-white active:bg-red-700"
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
