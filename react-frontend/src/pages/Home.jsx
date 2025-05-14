import React from "react";
import TodoList from "../features/todos/components/TodoList";

const Home = ({ onTodosUpdate }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <TodoList onUpdateTodos={onTodosUpdate} />
    </div>
  );
};

export default Home;
