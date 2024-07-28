import { useState } from "react";
import './TodoApp.css';

// Composant principal de l'application
function TodoAPP() {
  const [tasks, setTasks] = useState([]); // État pour les tâches
  const [filter, setFilter] = useState("all"); // État pour le filtre
  const [user, setUser] = useState(null); // État pour l'utilisateur actuel

  // Fonction pour ajouter une tâche
  const addTask = (task) => {
    const trimmedTask = task.length > 200 ? task.slice(0, 200) : task; // Limiter le texte à 200 caractères
    setTasks([...tasks, { text: trimmedTask, completed: false }]);
  };

  // Fonction pour basculer l'état d'accomplissement d'une tâche
  const toggleTaskCompletion = (index) => {
    const updatedTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Fonction pour supprimer une tâche
  const deleteTask = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  // Filtrer les tâches en fonction du filtre sélectionné
  const filteredTasks = tasks.filter(task => {
    if (filter === "all") return true;
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
  });

  return (
    <div className="todo-app">
      <h1>To-do list</h1>
      {!user ? (
        <Login setUser={setUser} /> /* Composant de connexion */
      ) : (
        <>
          <div>Bonjour, {user.name} ({user.role})</div> {/* Afficher l'utilisateur actuel */}
          <button onClick={() => setUser(null)}>Déconnexion</button> {/* Bouton de déconnexion */}
          {user.role === "admin" && <AjoutTodo addTask={addTask} />} {/* Seuls les admins peuvent ajouter des tâches */}
          <FilterButtons setFilter={setFilter} /> {/* Composant pour les boutons de filtre */}
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

// Composant pour ajouter une nouvelle tâche
function AjoutTodo({ addTask }) {
  const [newTask, setNewTask] = useState("");

  const handleAddTask = () => {
    if (newTask.trim()) { // Vérifie que la tâche n'est pas vide
      addTask(newTask);
      setNewTask(""); // Réinitialise le champ d'entrée
    }
  };

  return (
    <>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Ajouter une tâche"
        maxLength="200" // Limite d'entrée à 200 caractères
      />
      <button onClick={handleAddTask}>Ajouter une tâche</button>
    </>
  );
}

// Composant pour les boutons de filtre
function FilterButtons({ setFilter }) {
  return (
    <div className="filter-buttons">
      <button onClick={() => setFilter("all")}>Toutes</button>
      <button onClick={() => setFilter("active")}>Actives</button>
      <button onClick={() => setFilter("completed")}>Complétées</button>
    </div>
  );
}

// Composant pour afficher une tâche
function Task({ task, index, toggleTaskCompletion, deleteTask }) {
  // Fonction pour formater le texte de la tâche avec des retours à la ligne
  const formatTaskText = (text) => {
    const maxLineLength = 30; // Nombre de caractères avant retour à la ligne
    const regex = new RegExp(`(.{1,${maxLineLength}})`, 'g');
    return text.match(regex).join('<br />');
  };

  return (
    <li>
      {/* Utiliser dangerouslySetInnerHTML pour insérer des retours à la ligne */}
      <span
        className={`task-text ${task.completed ? 'completed' : ''}`}
        onClick={() => toggleTaskCompletion(index)}
        dangerouslySetInnerHTML={{ __html: formatTaskText(task.text) }}
      >
      </span>
      {task.completed && <DeleteButton deleteTask={() => deleteTask(index)} />} {/* Affiche le bouton de suppression si la tâche est complétée */}
    </li>
  );
}

// Composant pour le bouton de suppression d'une tâche
function DeleteButton({ deleteTask }) {
  return (
    <button className="delete-button" onClick={deleteTask}>Supprimer</button>
  );
}

// Composant de connexion
function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Simuler une authentification
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
