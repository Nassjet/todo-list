// src/TodoApp.js
import { useState, useEffect } from "react";
import { db } from "./firebaseconfig.js";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import './TodoApp.css';

function TodoAPP() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [user, setUser] = useState(null);

  const tasksCollectionRef = collection(db, "tasks");

  // Fonction pour récupérer les tâches depuis Firestore
  useEffect(() => {
    const getTasks = async () => {
      const data = await getDocs(tasksCollectionRef);
      setTasks(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getTasks();
  }, []);

  const addTask = async (task) => {
    const trimmedTask = task.length > 200 ? task.slice(0, 200) : task;
    const newTask = { text: trimmedTask, completed: false };
    await addDoc(tasksCollectionRef, newTask);
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = async (index) => {
    const taskDoc = doc(db, "tasks", tasks[index].id);
    const updatedTask = { ...tasks[index], completed: !tasks[index].completed };
    await updateDoc(taskDoc, updatedTask);
    const updatedTasks = tasks.map((task, i) => (i === index ? updatedTask : task));
    setTasks(updatedTasks);
  };

  const deleteTask = async (index) => {
    const taskDoc = doc(db, "tasks", tasks[index].id);
    await deleteDoc(taskDoc);
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    return false;
  });

  return (
    <div className="todo-app">
      <h1>To-do list</h1>
      {!user ? (
        <Login setUser={setUser} />
      ) : (
        <>
          <div>Bonjour, {user.name} ({user.role})</div>
          <button onClick={() => setUser(null)}>Déconnexion</button>
          {user.role === "admin" && <AjoutTodo addTask={addTask} />}
          <FilterButtons setFilter={setFilter} />
          <ul>
            {filteredTasks.map((task, index) => (
              <Task
                key={index}
                task={task}
                index={index}
                toggleTaskCompletion={toggleTaskCompletion}
                deleteTask={deleteTask}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

function AjoutTodo ({ addTask }) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTask(newTask);
      setNewTask("");
    }
  };

  return (
    <>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Ajouter une tâche"
        maxLength="200"
      />
      <button onClick={handleAddTask}>Ajouter une tâche</button>
    </>
  );
}

function FilterButtons({ setFilter }) {
  return (
    <div className="filter-buttons">
      <button onClick={() => setFilter("all")}>Toutes</button>
      <button onClick={() => setFilter("active")}>Actives</button>
      <button onClick={() => setFilter("completed")}>Complétées</button>
    </div>
  );
}

function Task({ task, index, toggleTaskCompletion, deleteTask }) {
  const formatTaskText = (text) => {
    const maxLineLength = 30;
    const regex = new RegExp(`(.{1,${maxLineLength}})`, 'g');
    return text.match(regex).join('<br />');
  };

  return (
    <li>
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleTaskCompletion(index)}
        dangerouslySetInnerHTML={{ __html: formatTaskText(task.text) }}
      >
      </span>
      {task.completed && <DeleteButton deleteTask={() => deleteTask(index)} />}
    </li>
  );
}

function DeleteButton({ deleteTask }) {
  return (
    <button className="delete-button" onClick={deleteTask}>Supprimer</button>
  );
}

function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setUser({ name: "Admin", role: "admin" });
    } else if (username === "user" && password === "user") {
      setUser({ name: "User", role: "user" });
    } else {
      alert("Nom d'utilisateur ou mot de passe incorrect");
    }
  };

  return (
    <div className="login">
      <h2>Connexion</h2>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nom d'utilisateur"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button onClick={handleLogin}>Se connecter</button>
    </div>
  );
}

export default TodoAPP;
