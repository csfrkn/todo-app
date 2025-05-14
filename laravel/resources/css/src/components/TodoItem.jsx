import React from "react";

export default function TodoItem({ todo, onDelete, onStatusChange }) {
  return (
    <li className="flex justify-between items-center border p-2 rounded">
      <div>
        <p className="font-semibold">{todo.title}</p>
        <small className="text-gray-500">Durum: {todo.status}</small>
      </div>
      <div className="flex gap-2">
        <select
          value={todo.status}
          onChange={(e) => onStatusChange(todo.id, e.target.value)}
          className="border p-1 rounded"
        >
          <option value="pending">Bekliyor</option>
          <option value="in_progress">Devam ediyor</option>
          <option value="completed">Tamamlandı</option>
        </select>
        <button onClick={() => onDelete(todo.id)} className="text-red-600">Sil</button>
      </div>
    </li>
  );
}
