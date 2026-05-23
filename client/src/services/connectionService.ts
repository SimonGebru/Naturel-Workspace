import api from "./api";

export const getConnections = async () => {
  const response = await api.get("/connections");

  return response.data.connections;
};

export const createConnection = async (connectionData: any) => {
  const response = await api.post(
    "/connections",
    connectionData
  );

  return response.data.connection;
};