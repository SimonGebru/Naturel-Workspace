<template>
  <section class="relative flex-1 bg-slate-950">

    <div
      v-if="loading"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950"
    >
      <div
        class="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500"
      />

      <p class="mt-5 text-sm text-slate-400">
        Loading workspace...
      </p>
    </div>

    <div
      v-else-if="!filteredNodes.length"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center"
    >
      <h2 class="text-xl font-semibold">
        No nodes found
      </h2>

      <p class="mt-3 text-sm text-slate-500">
        Create your first node to start building your workspace.
      </p>
    </div>

    <VueFlow
      v-else
      v-model:nodes="flowNodes"
      v-model:edges="flowEdges"
      :node-types="nodeTypes"
      fit-view-on-init
      class="h-full w-full"
      @node-click="handleNodeClick"
      @edge-click="handleEdgeClick"
      @pane-click="graphStore.clearSelectedNode"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleConnect"
    >
      <Background />

      <MiniMap
        :zoomable="true"
        :pannable="true"
        class="neural-minimap"
      />
    </VueFlow>

    <CreateConnectionModal
      v-if="pendingConnection"
      :source-node="pendingConnection.source"
      :target-node="pendingConnection.target"
      @close="pendingConnection = null"
    />

  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { VueFlow } from "@vue-flow/core";
import { Background } from "@vue-flow/background";
import { MiniMap } from "@vue-flow/minimap";

import "@vue-flow/core/dist/style.css";
import "@vue-flow/core/dist/theme-default.css";
import "@vue-flow/minimap/dist/style.css";

import { useGraphStore } from "../../stores/graphStore";
import NeuralNode from "./NeuralNode.vue";
import CreateConnectionModal from "./CreateConnectionModal.vue";

const graphStore = useGraphStore();

const pendingConnection = ref<null | {
  source: string;
  target: string;
}>(null);

const nodeTypes = {
  neural: NeuralNode,
};

const {
  filteredNodes,
  connections,
  selectedNodeId,
  loading
} = storeToRefs(graphStore);

const connectedNodeIds = computed(() => {
  if (!selectedNodeId.value) {
    return [];
  }

  return connections.value.flatMap(
    (connection: any) => {

      const sourceId =
        typeof connection.sourceNode === "string"
          ? connection.sourceNode
          : connection.sourceNode._id;

      const targetId =
        typeof connection.targetNode === "string"
          ? connection.targetNode
          : connection.targetNode._id;

      if (sourceId === selectedNodeId.value) {
        return [targetId];
      }

      if (targetId === selectedNodeId.value) {
        return [sourceId];
      }

      return [];
    }
  );
});

const flowNodes = computed(() =>
  filteredNodes.value.map((node: any) => {

    const isSelected =
      selectedNodeId.value === node._id;

    const isConnected =
      connectedNodeIds.value.includes(
        node._id
      );

    const shouldDim =
      selectedNodeId.value &&
      !isSelected &&
      !isConnected;

    return {
      id: node._id,

      type: "neural",

      position: {
        x: node.position?.x ?? 0,
        y: node.position?.y ?? 0,
      },

      data: {
        label: node.title,
        nodeType: node.type,
        description: node.description,
      },

      class: shouldDim
        ? "dim-node"
        : isSelected
        ? "selected-neural-node"
        : isConnected
        ? "connected-node"
        : "neural-node",
    };
  })
);

const flowEdges = computed(() =>
  connections.value.map((connection: any) => {
    const sourceId =
      typeof connection.sourceNode === "string"
        ? connection.sourceNode
        : connection.sourceNode._id;

    const targetId =
      typeof connection.targetNode === "string"
        ? connection.targetNode
        : connection.targetNode._id;

    const isRelatedToSelected =
      selectedNodeId.value &&
      (sourceId === selectedNodeId.value ||
        targetId === selectedNodeId.value);

    const shouldDim =
      selectedNodeId.value && !isRelatedToSelected;

    return {
      id: connection._id,
      source: sourceId,
      target: targetId,
      label: connection.label || connection.type,
      type: "bezier",
      animated: isRelatedToSelected || !selectedNodeId.value,
      style: {
        stroke: isRelatedToSelected ? "#22d3ee" : "#475569",
        strokeWidth: isRelatedToSelected ? 3 : 1.5,
        opacity: shouldDim ? 0.15 : 1,
        filter: isRelatedToSelected
          ? "drop-shadow(0px 0px 10px rgba(34,211,238,0.8))"
          : "drop-shadow(0px 0px 4px rgba(71,85,105,0.3))",
      },
      labelStyle: {
        fill: isRelatedToSelected ? "#cffafe" : "#94a3b8",
        fontSize: 11,
      },
      labelBgStyle: {
        fill: "#020617",
        fillOpacity: shouldDim ? 0.4 : 0.85,
      },
      labelBgPadding: [6, 4],
      labelBgBorderRadius: 8,
    };
  })
);

const handleNodeClick = (event: any) => {
  graphStore.selectNode(event.node.id);
};

const handleEdgeClick = (event: any) => {
  graphStore.selectConnection(event.edge.id);
};

const handleNodeDragStop = (event: any) => {
  graphStore.saveNodePosition(event.node.id, event.node.position);
};

const handleConnect = (connection: any) => {
  pendingConnection.value = {
    source: connection.source,
    target: connection.target,
  };
};

onMounted(() => {
  graphStore.fetchGraph();
});
</script>

<style>
.neural-node {
  transition: transform 0.2s ease, filter 0.2s ease;
}

.neural-node:hover {
  filter: brightness(1.15);
}

.selected-neural-node {
  filter: brightness(1.25);
}

.neural-minimap {
  background: rgba(2, 6, 23, 0.95) !important;
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.neural-minimap .vue-flow__minimap-mask {
  fill: rgba(99, 102, 241, 0.15);
}

.neural-minimap .vue-flow__minimap-node {
  fill: #8b5cf6;
}

.neural-minimap svg {
  background: transparent;
}
.connected-node {
  filter: brightness(1.1);
}

.dim-node {
  opacity: 0.25;
  transition: opacity 0.25s ease;
}
</style>