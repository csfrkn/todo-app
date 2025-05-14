import { useEffect, useState } from "react";
import { getTodos, deleteTodo, updateStatus } from "../services/todoService";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";

export default function TodoList() {
  const [todos, setTodos] = useState([]);

  const fetchTodos = async () => {
    const res = await getTodos();
    setTodos(res.data.data.data); // paginate içindeki gerçek todos
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    await deleteTodo(id);
    fetchTodos();
  };

  const handleStatusChange = async (id, status) => {
    await updateStatus(id, status);
    fetchTodos();
  };

  return (
    <div className="space-y-4">
      <TodoForm onSuccess={fetchTodos} />
      <ul className="space-y-2">
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
          />
        ))}
      </ul>
    </div>
  );
}
