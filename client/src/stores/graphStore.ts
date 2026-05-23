import { defineStore } from "pinia";
import { computed, ref } from "vue";

import {
createNode,
getNodes,
updateNode,
deleteNode,
} from "../services/nodeService";
import {
  getConnections,
  createConnection,
} from "../services/connectionService";

export const useGraphStore = defineStore("graph", () => {
  const nodes = ref<any[]>([]);
  const connections = ref<any[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const loading = ref(false);
  const selectedFilter = ref("all");

  const nodeCount = computed(() => {
    return nodes.value.length;
  });

  const connectionCount = computed(() => {
    return connections.value.length;
  });

  const selectedNode = computed(() => {
    return (
      nodes.value.find((node) => node._id === selectedNodeId.value) || null
    );
  });

  const fetchGraph = async () => {
    try {
      loading.value = true;

      const [nodesResponse, connectionsResponse] = await Promise.all([
        getNodes(),
        getConnections(),
      ]);

      nodes.value = nodesResponse;
      connections.value = connectionsResponse;
    } catch (error) {
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  const createNewNode = async (nodeData: any) => {
    try {
      const newNode = await createNode(nodeData);

      nodes.value.unshift(newNode);

      return newNode;
    } catch (error) {
      console.error(error);
    }
  };

  const createNewConnection = async (
  sourceNode: string,
  targetNode: string,
  type = "related_to",
  label = "related"
) => {
  try {
    const newConnection = await createConnection({
      sourceNode,
      targetNode,
      type,
      label,
      strength: 3,
    });

    connections.value.unshift(newConnection);

    return newConnection;
  } catch (error) {
    console.error(error);
  }
};
const updateExistingNode = async (
  nodeId: string,
  updates: any
) => {
  try {
    const updatedNode =
      await updateNode(nodeId, updates);

    const index =
      nodes.value.findIndex(
        node => node._id === nodeId
      );

    if (index !== -1) {
      nodes.value[index] = updatedNode;
    }

    return updatedNode;
  } catch (error) {
    console.error(error);
  }
};

const deleteExistingNode = async (nodeId: string) => {
  try {
    await deleteNode(nodeId);

    nodes.value = nodes.value.filter((node) => node._id !== nodeId);

    connections.value = connections.value.filter((connection: any) => {
      const sourceId =
        typeof connection.sourceNode === "string"
          ? connection.sourceNode
          : connection.sourceNode._id;

      const targetId =
        typeof connection.targetNode === "string"
          ? connection.targetNode
          : connection.targetNode._id;

      return sourceId !== nodeId && targetId !== nodeId;
    });

    if (selectedNodeId.value === nodeId) {
      selectedNodeId.value = null;
    }
  } catch (error) {
    console.error(error);
  }
};

  const saveNodePosition = async (
    nodeId: string,
    position: { x: number; y: number },
  ) => {
    const currentNode = nodes.value.find((node) => node._id === nodeId);

    if (!currentNode) {
      return;
    }

    currentNode.position = position;

    try {
      const updatedNode = await updateNode(nodeId, {
        ...currentNode,
        position,
      });

      const index = nodes.value.findIndex((node) => node._id === nodeId);

      if (index !== -1) {
        nodes.value[index] = updatedNode;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectNode = (nodeId: string) => {
    selectedNodeId.value = nodeId;
  };

  const clearSelectedNode = () => {
    selectedNodeId.value = null;
  };

  return {
  nodes,
  connections,
  selectedNodeId,
  selectedNode,
  selectedFilter,
  nodeCount,
  connectionCount,
  loading,
  fetchGraph,
  createNewNode,
  createNewConnection,
  updateExistingNode,
  deleteExistingNode,
  saveNodePosition,
  selectNode,
  clearSelectedNode,
};
});
