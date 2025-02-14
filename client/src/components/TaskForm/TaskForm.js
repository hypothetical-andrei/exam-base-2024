import React, { useState, useContext, useEffect } from "react";
import AppContext from "../../state/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const TaskForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [label, setLabel] = useState("bug");
  const globalState = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    globalState.task.emitter.removeAllListeners("GET_TASKS_SUCCESS");
    globalState.task.emitter.addListener("GET_TASKS_SUCCESS", () => {
      navigate(`/projects/${params.pid}/tasks`);
    });
  }, []);

  return (
    <div>
      <h1>Task Form</h1>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={label} onChange={(e) => setLabel(e.target.value)}>
        <option value="bug">Bug</option>
        <option value="feature">Feature</option>
        <option value="urgent">Urgent</option>
      </select>
      <button
        onClick={() => {
          globalState.task.createOne(globalState, params.pid, {
            title,
            description,
            label,
          });
        }}
      >
        Create
      </button>
    </div>
  );
};

export default TaskForm;
