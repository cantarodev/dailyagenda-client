import privateClient from "../client/private.client";

const endPoints = {
  createSubscription: "subscriptions",
};

const subscriptionApi = {
  createSubscription: async (data) => {
    try {
      const response = await privateClient.post(
        endPoints.createSubscription,
        data
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default subscriptionApi;
