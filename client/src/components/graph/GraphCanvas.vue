<template>
  <section class="flex-1 bg-slate-950">
    <VueFlow
      v-model:nodes="flowNodes"
      v-model:edges="flowEdges"
      :node-types="nodeTypes"
      fit-view-on-init
      class="h-full w-full"
      @node-click="handleNodeClick"
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

const { nodes, connections, selectedNodeId } = storeToRefs(graphStore);

const flowNodes = computed(() =>
  nodes.value.map((node: any) => ({
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
    class:
      selectedNodeId.value === node._id
        ? "selected-neural-node"
        : "neural-node",
  }))
);

const flowEdges = computed(() =>
  connections.value.map((connection: any) => ({
    id: connection._id,
    source:
      typeof connection.sourceNode === "string"
        ? connection.sourceNode
        : connection.sourceNode._id,
    target:
      typeof connection.targetNode === "string"
        ? connection.targetNode
        : connection.targetNode._id,
    label: connection.label || connection.type,
    type: "bezier",
    animated: true,
    style: {
      stroke: "#06b6d4",
      strokeWidth: 2,
      filter: "drop-shadow(0px 0px 8px rgba(6,182,212,0.6))",
    },
    labelStyle: {
      fill: "#94a3b8",
      fontSize: 11,
    },
    labelBgStyle: {
      fill: "#020617",
      fillOpacity: 0.85,
    },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 8,
  }))
);

const handleNodeClick = (event: any) => {
  graphStore.selectNode(event.node.id);
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
</style>