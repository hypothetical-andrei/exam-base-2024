import EventEmitter from "../../utils/EventEmitter";
import { SERVER } from "../../config/global";

class TaskStore {
  constructor() {
    this.data = [];
    this.count = 0;
    this.selectedTask = null;
    this.emitter = new EventEmitter();
  }

  async getAll(state, projectId, pageNumber = 0, pageSize = 10) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          headers: {
            authorization: state.user.data.token,
          },
        }
      );
      if (!response.ok) {
        throw response;
      }
      const content = await response.json();
      this.data = content.data;
      this.count = content.count;
      this.emitter.emit("GET_TASKS_SUCCESS");
    } catch (err) {
      console.warn(err);
      this.emitter.emit("GET_TASKS_ERROR");
    }
  }

  async getOne(state, projectId, taskId) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}`,
        {
          headers: {
            authorization: state.user.data.token,
          },
        }
      );
      if (!response.ok) {
        throw response;
      }
      const content = await response.json();
      this.selectedTask = content;
      this.emitter.emit("GET_TASK_SUCCESS");
    } catch (err) {
      console.warn(err);
      this.emitter.emit("GET_TASK_ERROR");
    }
  }

  async createOne(state, projectId, task) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            authorization: state.user.data.token,
          },
          body: JSON.stringify(task),
        }
      );
      if (!response.ok) {
        throw response;
      }
      this.getAll(state, projectId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("ADD_TASK_ERROR");
    }
  }

  async updateOne(state, projectId, id, task) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${id}`,
        {
          method: "put",
          headers: {
            "Content-Type": "application/json",
            authorization: state.user.data.token,
          },
          body: JSON.stringify(task),
        }
      );
      if (!response.ok) {
        throw response;
      }
      this.getAll(state, projectId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("SAVE_TASK_ERROR");
    }
  }

  async deleteOne(state, projectId, id) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${id}`,
        {
          method: "delete",
          headers: {
            authorization: state.user.data.token,
          },
        }
      );
      if (!response.ok) {
        throw response;
      }
      this.getAll(state, projectId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("DELETE_TASK_ERROR");
    }
  }

  async assign(state, projectId, taskId, userId) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/assignments`,
        {
          method: "post",
          headers: {
            authorization: state.user.data.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ assignedTo: userId }),
        }
      );
      if (!response.ok) {
        throw response;
      }
      this.getAll(state, projectId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("ASSIGN_TASK_ERROR");
    }
  }

  async updateStatus(state, projectId, taskId, status) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/status`,
        {
          method: "put",
          headers: {
            authorization: state.user.data.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );
      if (!response.ok) {
        throw response;
      }
      this.getAll(state, projectId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("UPDATE_STATUS_ERROR");
    }
  }

  async getComments(state, projectId, taskId) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          headers: {
            authorization: state.user.data.token,
          },
        }
      );
      if (!response.ok) {
        throw response;
      }
      const content = await response.json();
      this.selectedTask.comments = content;
      this.emitter.emit("GET_COMMENTS_SUCCESS");
    } catch (err) {
      console.warn(err);
      this.emitter.emit("GET_COMMENTS_ERROR");
    }
  }

  // Store - adaugam un comentariu pentru un task
  async addComment(state, projectId, taskId, content) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/comments`,
        {
          method: "POST",
          headers: {
            authorization: state.user.data.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        throw response;
      }
      await this.getComments(state, projectId, taskId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("ADD_COMMENT_ERROR");
    }
  }

  // Store - stergem un comentariu pentru un task
  async deleteComment(state, projectId, taskId, commentId) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            authorization: state.user.data.token,
          },
        }
      );
      if (!response.ok) {
        throw response;
      }
      await this.getComments(state, projectId, taskId); // Refresh comments list
    } catch (err) {
      console.warn(err);
      this.emitter.emit("DELETE_COMMENT_ERROR");
    }
  }

  // Store - update comment
  async updateComment(state, projectId, taskId, commentId, content) {
    try {
      const response = await fetch(
        `${SERVER}/api/users/${state.user.data.id}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            authorization: state.user.data.token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );
      if (!response.ok) {
        throw response;
      }
      await this.getComments(state, projectId, taskId);
    } catch (err) {
      console.warn(err);
      this.emitter.emit("UPDATE_COMMENT_ERROR");
    }
  }
}

export default TaskStore;
