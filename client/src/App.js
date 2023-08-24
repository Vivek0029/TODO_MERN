import { useState, useEffect } from "react";
import "./App.css";
const url = "https://todo-mern-server-hxml.onrender.com"

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");

          useEffect(() => {
            getTodos();
          }, [])

          const getTodos = () => {
            fetch(url + '/todos')
			      .then(res => res.json())
			      .then(data => setTodos(data))
			      .catch((err) => alert("Error: ", err));
          }

          const completeTodo = async id => {
            const data = await fetch(url + '/todo/complete/' + id).then(res => res.json());
        
            setTodos(todos => todos.map(todo => {
              if (todo._id === data._id) {
                todo.complete = data.complete;
              }
        
              return todo;
            }));
            
          }

          const addTodo = async () => {

            if (!newTodo.trim()) {
              alert("Todo cannot be empty");
              return;
          }
      
            if (todos.some(todo => todo.text === newTodo)) {
              alert("Todo already exists");
              return;
          }
            const data = await fetch(url + "/todo/new", {
              method: "POST",
              headers: {
                "Content-Type": "application/json" 
              },
              body: JSON.stringify({
                text: newTodo
              })
            }).then(res => res.json());
        
            setTodos([...todos, data]);
        
            setNewTodo("");
          }
          
          const deleteTodo = async id => {
            const data = await fetch(url + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());
        
            setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
          }

          const handleTodoTextChange = (id, newText) => {
            setTodos((prevTodos) =>
              prevTodos.map((todo) =>
                todo._id === id ? { ...todo, text: newText } : todo
              )
            );
          };

          const updateTodo = async (id, newText) => {
            const response = await fetch(url + '/todo/update/' + id, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: newText })
            });
        
            if (response.ok) {
                handleTodoTextChange(id, newText);
            }
        };
        
  return (
    <div className="App">
      <div className="container">
        <div className="main">
          <h1>Welcome, Enter today's todo!</h1>
          <div className="input-data">
            <input
              className="inputbox"
              placeholder="What do you have planned?"
              type="text"
              onChange={e => setNewTodo(e.target.value)} 
              value={newTodo}
            />
            <button className="button-1" onClick={addTodo}> Enter </button>
          </div>
        </div>

        <div className="main-2">
          {todos.map((todo) => ( todo &&
            (<div className="list" key={todo._id}>
              <div className="combine">
                <input
                  className="checkbox"
                  type="checkbox"
                  onChange={() => completeTodo(todo._id)}
                  checked={todo.complete}
                />
                <input
                  className="inputbox-1"
                  type="text"
                  name="inputbox"
                  onChange={(e) => handleTodoTextChange(todo._id, e.target.value)}
                  onBlur={() => updateTodo(todo._id, todo.text)}
                  value={todo.text}
                />
              </div>
              <button className="button-1" onClick={() => deleteTodo(todo._id)} > Delete </button>
            </div>
          )))}
        </div>
      </div>
    </div>
  );
}

export default App;
