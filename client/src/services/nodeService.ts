import api from "./api";

export const getNodes = async (
  workspaceId:string
) => {

  const response =
    await api.get(
      `/nodes?workspaceId=${workspaceId}`
    );

  return response.data;
};

export const createNode = async (nodeData: any) => {
  const response = await api.post("/nodes", nodeData);

  return response.data.node;
};

export const updateNode = async (
  nodeId: string,
  nodeData: any
) => {
  const response = await api.put(
    `/nodes/${nodeId}`,
    nodeData
  );

  return response.data.node;
};

export const deleteNode = async (
  nodeId: string
) => {
  await api.delete(`/nodes/${nodeId}`);
};