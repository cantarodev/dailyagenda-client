import privateClient from "../client/private.client";

const userEndpoints = {
  login: "users/login",
  signup: "users/signup",
};

const userApi = {
  login: async ({ email, password }) => {
    try {
      const response = await privateClient.post(userEndpoints.login, {
        email,
        password,
      });

      return { response };
    } catch (err) {
      return { err };
    }
  },
  signup: async ({ email, password }) => {
    try {
      const response = await privateClient.post(userEndpoints.signup, {
        email,
        password,
      });

      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default userApi;
