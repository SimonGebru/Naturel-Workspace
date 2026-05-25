import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { toast } from "vue-sonner";

import {
  createNode,
  getNodes,
  updateNode,
  deleteNode,
} from "../services/nodeService";

import {
  getConnections,
  createConnection,
  deleteConnection,
} from "../services/connectionService";

export const useGraphStore = defineStore("graph", () => {
  const nodes = ref<any[]>([]);
  const connections = ref<any[]>([]);
  const selectedNodeId = ref<string | null>(null);
  const selectedConnectionId = ref<string | null>(null);
  const loading = ref(false);
  const selectedFilter = ref("all");
  const searchQuery = ref("");

  const filteredNodes = computed(() => {
    return nodes.value.filter((node) => {
      const matchesFilter =
        selectedFilter.value === "all" || node.type === selectedFilter.value;

      const query = searchQuery.value.toLowerCase();

      const matchesSearch =
        node.title?.toLowerCase().includes(query) ||
        node.description?.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  });

  const nodeCount = computed(() => nodes.value.length);

  const connectionCount = computed(() => connections.value.length);

  const selectedNode = computed(() => {
    return nodes.value.find((node) => node._id === selectedNodeId.value) || null;
  });

  const selectedConnection = computed(() => {
    return (
      connections.value.find(
        (connection) => connection._id === selectedConnectionId.value
      ) || null
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

      toast.success("Node created");

      return newNode;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create node");
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

      toast.success("Connection created");

      return newConnection;
    } catch (error) {
      console.error(error);
      toast.error("Failed to create connection");
    }
  };

  const updateExistingNode = async (nodeId: string, updates: any) => {
    try {
      const updatedNode = await updateNode(nodeId, updates);

      const index = nodes.value.findIndex((node) => node._id === nodeId);

      if (index !== -1) {
        nodes.value[index] = updatedNode;
      }

      toast.success("Node updated");

      return updatedNode;
    } catch (error) {
      console.error(error);
      toast.error("Failed to update node");
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

      toast.success("Node deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete node");
    }
  };

  const selectConnection = (connectionId: string) => {
    selectedConnectionId.value = connectionId;
    selectedNodeId.value = null;
  };

  const clearSelectedConnection = () => {
    selectedConnectionId.value = null;
  };

  const deleteExistingConnection = async (connectionId: string) => {
    try {
      await deleteConnection(connectionId);

      connections.value = connections.value.filter(
        (connection) => connection._id !== connectionId
      );

      if (selectedConnectionId.value === connectionId) {
        selectedConnectionId.value = null;
      }

      toast.success("Connection deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete connection");
    }
  };

  const saveNodePosition = async (
    nodeId: string,
    position: { x: number; y: number }
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
    selectedConnectionId.value = null;
  };

  const clearSelectedNode = () => {
    selectedNodeId.value = null;
    selectedConnectionId.value = null;
  };

  return {
    nodes,
    connections,
    selectedNodeId,
    selectedConnectionId,
    selectedNode,
    selectedConnection,
    selectedFilter,
    searchQuery,
    filteredNodes,
    nodeCount,
    connectionCount,
    loading,
    fetchGraph,
    createNewNode,
    createNewConnection,
    updateExistingNode,
    deleteExistingNode,
    selectConnection,
    clearSelectedConnection,
    deleteExistingConnection,
    saveNodePosition,
    selectNode,
    clearSelectedNode,
  };
});
