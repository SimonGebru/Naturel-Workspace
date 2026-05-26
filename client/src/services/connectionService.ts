import api from "./api";

export const getConnections = async (
  workspaceId:string
) => {

  const response =
    await api.get(
      `/connections?workspaceId=${workspaceId}`
    );

  return response.data;
};

export const createConnection = async (connectionData: any) => {
  const response = await api.post("/connections", connectionData);

  return response.data.connection;
};

export const deleteConnection = async (connectionId: string) => {
  await api.delete(`/connections/${connectionId}`);
};