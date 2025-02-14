import "./TaskList.css";
import React, { use, useContext, useEffect, useState } from "react";
import AppContext from "../../state/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import Task from "./Task";
import Paginator from "../Paginator/Paginator";

const TaskList = () => {
  const globalState = useContext(AppContext);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    globalState.task.getAll(globalState, params.pid, pageNumber, pageSize);
    globalState.task.emitter.addListener("GET_TASKS_SUCCESS", () => {
      setTasks(globalState.task.data);
    });
  }, [pageNumber, pageSize]);

  return (
    <div className="task-list">
      <h1>Task list</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Status</th>
            <th>Label</th>
            <th>Assigned To</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <Task key={task.id} task={task} />
          ))}
        </tbody>
      </table>
      <div className="footer">
        <button onClick={() => navigate(`/projects/${params.pid}/tasks/new`)}>
          Create Task
        </button>
      </div>

      <Paginator
        onPageChange={(pageNumber) => setPageNumber(pageNumber)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        totalRecords={globalState.task.count}
      />
    </div>
  );
};

export default TaskList;
