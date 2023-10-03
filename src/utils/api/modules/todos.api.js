import privateClient from "../client/private.client";

const todoEndpoints = {
  create: "todos",
  update: "todos",
  delete: "todos",
  deleteAll: "todos",
};

const todoApi = {
  create: async (data) => {
    try {
      const response = await privateClient.post(todoEndpoints.create, data);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  update: async (data, id) => {
    try {
      const response = await privateClient.put(
        `${todoEndpoints.update}/${id}`,
        data
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  delete: async (id) => {
    try {
      const response = await privateClient.delete(
        `${todoEndpoints.delete}/${id}`
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  deleteAll: async () => {
    try {
      const response = await privateClient.delete(todoEndpoints.deleteAll);
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default todoApi;
