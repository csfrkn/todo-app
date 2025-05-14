import React,{ useState } from "react";
import { addTodo } from "../services/todoService";

export default function TodoForm({ onSuccess }) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    await addTodo({ title });
    setTitle("");
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Yeni görev..."
        className="border p-2 flex-1 rounded"
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Ekle
      </button>
    </form>
  );
}
