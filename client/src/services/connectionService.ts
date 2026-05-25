import api from "./api";

export const getConnections = async () => {
  const response = await api.get("/connections");

  return response.data.connections;
};

export const createConnection = async (connectionData: any) => {
  const response = await api.post("/connections", connectionData);

  return response.data.connection;
};

export const deleteConnection = async (connectionId: string) => {
  await api.delete(`/connections/${connectionId}`);
};