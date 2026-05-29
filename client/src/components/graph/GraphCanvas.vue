<template>
  <section class="relative flex-1 overflow-hidden bg-[#020617]">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(139,92,246,0.22),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.14),transparent_32%)]" />
    <div class="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.035)_1px,transparent_1px)] bg-[size:28px_28px]" />
    <div class="pointer-events-none absolute inset-0 bg-slate-950/35" />

    <div
      v-if="loading"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/90"
    >
      <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-violet-500" />
      <p class="mt-5 text-sm text-slate-400">Loading workspace...</p>
    </div>

    <div
      v-else-if="!filteredNodes.length"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center text-center"
    >
      <div class="rounded-3xl border border-slate-800 bg-slate-900/80 px-8 py-7 shadow-2xl backdrop-blur-xl">
        <h2 class="text-xl font-semibold">No nodes found</h2>
        <p class="mt-3 max-w-sm text-sm leading-6 text-slate-500">
          Create your first node to start building this workspace.
        </p>
      </div>
    </div>

    <VueFlow
      v-else
      :nodes="flowNodes"
      :edges="flowEdges"
      :node-types="nodeTypes"
      fit-view-on-init
      class="relative z-10 h-full w-full neural-flow"
      @node-click="handleNodeClick"
      @edge-click="handleEdgeClick"
      @pane-click="graphStore.clearSelectedNode"
      @node-drag-stop="handleNodeDragStop"
      @connect="handleConnect"
    >
      <Background
        :gap="28"
        :size="1"
        color="#334155"
      />

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
import { computed, markRaw, onMounted, ref } from "vue";
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
  neural: markRaw(NeuralNode),
};

const {
  filteredNodes,
  connections,
  selectedNodeId,
  loading,
} = storeToRefs(graphStore);

const connectedNodeIds = computed(() => {
  if (!selectedNodeId.value) return [];

  return connections.value.flatMap((connection: any) => {
    const sourceId =
      typeof connection.sourceNode === "string"
        ? connection.sourceNode
        : connection.sourceNode._id;

    const targetId =
      typeof connection.targetNode === "string"
        ? connection.targetNode
        : connection.targetNode._id;

    if (sourceId === selectedNodeId.value) return [targetId];
    if (targetId === selectedNodeId.value) return [sourceId];

    return [];
  });
});

const flowNodes = computed(() =>
  filteredNodes.value.map((node: any) => {
    const isSelected = selectedNodeId.value === node._id;
    const isConnected = connectedNodeIds.value.includes(node._id);

    const shouldDim =
      selectedNodeId.value && !isSelected && !isConnected;

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
      (sourceId === selectedNodeId.value || targetId === selectedNodeId.value);

    const shouldDim = selectedNodeId.value && !isRelatedToSelected;

    return {
      id: connection._id,
      source: sourceId,
      target: targetId,
      label: connection.label || connection.type,
      type: "default",
      animated: isRelatedToSelected || !selectedNodeId.value,
      style: {
        stroke: isRelatedToSelected ? "#22d3ee" : "#64748b",
        strokeWidth: isRelatedToSelected ? 3 : 1.6,
        opacity: shouldDim ? 0.12 : 0.9,
        filter: isRelatedToSelected
          ? "drop-shadow(0px 0px 12px rgba(34,211,238,0.9))"
          : "drop-shadow(0px 0px 5px rgba(100,116,139,0.35))",
      },
      labelStyle: {
        fill: isRelatedToSelected ? "#cffafe" : "#94a3b8",
        fontSize: 11,
        fontWeight: 600,
      },
      labelBgStyle: {
        fill: "#020617",
        fillOpacity: shouldDim ? 0.35 : 0.88,
      },
      labelBgPadding: [8, 5],
      labelBgBorderRadius: 10,
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
.neural-flow {
  background: transparent;
}

.neural-flow .vue-flow__pane {
  cursor: grab;
}

.neural-flow .vue-flow__pane:active {
  cursor: grabbing;
}

.neural-node {
  transition: opacity 0.25s ease, filter 0.25s ease, transform 0.25s ease;
}

.neural-node:hover {
  filter: brightness(1.18);
}

.selected-neural-node {
  filter: brightness(1.3);
  transform: scale(1.02);
}

.connected-node {
  filter: brightness(1.15);
}

.dim-node {
  opacity: 0.22;
  transition: opacity 0.25s ease;
}

.neural-minimap {
  background: rgba(2, 6, 23, 0.92) !important;
  border: 1px solid rgba(51, 65, 85, 0.8);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(14px);
  box-shadow: 0 0 30px rgba(15, 23, 42, 0.8);
}

.neural-minimap .vue-flow__minimap-mask {
  fill: rgba(99, 102, 241, 0.16);
}

.neural-minimap .vue-flow__minimap-node {
  fill: #8b5cf6;
}

.neural-minimap svg {
  background: transparent;
}
</style>