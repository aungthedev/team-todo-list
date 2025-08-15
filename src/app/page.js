"use client";

import { useState, useEffect, ustRef, useRef } from "react";
import {
  PencilIcon,
  TrashIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/solid";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currentTodo, setCurrentTodo] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  // 🔁 Load todos from backend on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  useEffect(() => {
    titleRef.current?.focus();
  }, [darkMode]);

  const fetchTodos = async () => {
    try {
      const res = await fetch("/api/todos");
      const data = await res.json();
      setTodoList(data);
    } catch {
      toast.error("Failed to fetch todos.");
    }
  };

  const addTodo = async () => {
    if (title !== "" || description !== "") {
      try {
        const res = await fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, description }),
        });
        const newTodo = await res.json();
        setTodoList((prev) => [...prev, newTodo]);
        setTitle("");
        setDescription("");
        toast.success("Todo added!");
      } catch {
        toast.error("Failed to add todo.");
      }
    }
  };

 
const clearAllTodos = async () => {
  try {
    const res = await fetch("/api/todos", { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to clear todos");
    }

    setTodoList([]);
    toast.success("All todos cleared!");
  } catch (error) {
    toast.error("Failed to clear todos.");
  }
};


  // NEW: Delete todo function
  const deleteTodo = async (id) => {
    try {
      await fetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodoList(todoList.filter((todo) => todo.id !== id));
      toast.success("Todo deleted!");
    } catch {
      toast.error("Failed to delete todo.");
    }
  };

  const updateTodo = async () => {
    if (!currentTodo) return;
    try {
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
      toast.success("Todo updated!");
    } catch {
      toast.error("Failed to update todo.");
    }
  };

  const toggleTodoStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ done: newStatus }),
      });

      if (!res.ok) {
        toast.error("Failed to update status.");
        return;
      }

      const updatedTodo = await res.json();
      setTodoList((prev) =>
        prev.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
      );
      toast.success("Status updated!");
    } catch {
      toast.error("Error updating status.");
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex flex-col min-h-screen w-full justify-center items-center bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
        <div className="flex justify-end w-full max-w-4xl mb-4">
          <button
            onClick={() => setDarkMode(!darkMode)} // ✅ Toggle dark mode
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-md"
          >
            {darkMode ? (
              <SunIcon className="h-5 w-5" />
            ) : (
              <MoonIcon className="h-5 w-5" />
            )}
            <span>{darkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </div>
        <div className="flex flex-col border rounded-lg shadow-lg w-full max-w-4xl p-6 space-y-6 bg-white dark:bg-gray-800 dark:text-gray-100">
          {/* 📝 Title */}
          <h1
            className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 tracking-tight flex items-center justify-center space-x-2"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            <ClipboardDocumentListIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
            <span>Todo List ({todoList.length})</span>
          </h1>
          <p className="text-sm text-center text-gray-600 italic dark:text-gray-400 italic">
            Track your goals. Make progress daily.
          </p>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              currentTodo ? updateTodo() : addTodo();
            }}
            className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 w-full"
          >
            <input
              ref={titleRef}
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") {
                  descriptionRef.current?.focus();
                }
              }}
              className="border rounded-md p-2 text-sm w-full sm:w-1/3 
             focus:outline-none focus:ring-2 focus:ring-blue-500 
             dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
             whitespace-normal break-words min-h-[40px]"
            />
            <input
              ref={descriptionRef}
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft") {
                  titleRef.current?.focus();
                }
              }}
              className="border rounded-md p-2 text-sm w-full sm:w-1/3 
           focus:outline-none focus:ring-2 focus:ring-blue-500 
           dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
           whitespace-normal break-words"
            />
            <button
              type="submit"
              className="rounded-md px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm w-full sm:w-1/4 transition"
              onClick={(e) => {
                e.preventDefault();
                currentTodo ? updateTodo() : addTodo();
              }}
            >
              {currentTodo ? "Update" : "Add"} Todo!
            </button>
          </form>

          {/* Table */}
          <div className="overflow-x-auto border rounded-md">
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-200">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                <tr>
                  <th className="py-3 px-6">Title</th>
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-6">Actions</th>
                </tr>
              </thead>
              <tbody>
                {todoList.map((todo, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 border-b transition dark:odd:bg-gray-800 dark:even:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition"
                  >
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-200 max-w-[200px] break-all whitespace-normal">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          checked={todo.done}
                          onChange={() => toggleTodoStatus(todo.id, !todo.done)}
                          className="mr-2 w-5 h-5 rounded-full border-2 border-blue-500 bg-white checked:bg-blue-600 checked:border-blue-600 cursor-pointer"
                        />
                        {/* Causing error in toggle to do list so this won't work yet */}
                        <span
                          className={
                            todo.done
                              ? "line-through text-gray-400 dark:text-gray-500"
                              : ""
                          }
                        >
                          {todo.title}
                        </span>
                      </label>
                    </td>
                    <td className="py-3 px-6 text-gray-700 dark:text-gray-200 max-w-[300px] break-all whitespace-normal">
                      <span
                        className={
                          todo.done
                            ? "line-through text-gray-400 dark:text-gray-500"
                            : ""
                        }
                      >
                        {todo.description}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex space-x-4">
                        <button
                          className="flex items-center text-blue-600 hover:text-blue-900 transition dark:text-blue-400 dark:hover:text-blue-300"
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
                          className="flex items-center text-red-500 hover:text-red-700 transition dark:text-red-400 dark:hover:text-red-300"
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
            {todoList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ClipboardDocumentListIcon className="h-12 w-12 mb-4 text-gray-400" />
                <p className="text-sm italic">
                  No tasks yet. Add something to get started!
                </p>

                <button
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  onClick={() => {
                    setTitle("New Task");
                    setDescription("Your first todo");
                  }}
                >
                  Add Your First Task
                </button>
              </div>
            )}
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
    </div>
  );
}
