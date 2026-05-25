<template>
  <main class="h-screen bg-slate-950 text-white flex">
    <Sidebar />

    <div class="flex flex-col flex-1">
      <Topbar @open-create-node="showCreateNodeModal = true" />

      <div class="flex flex-1 overflow-hidden">
        <GraphCanvas />

        <NodeDetailsPanel />
      </div>
    </div>

    <CreateNodeModal
      v-if="showCreateNodeModal"
      @close="showCreateNodeModal = false"
    />
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import GraphCanvas from "../graph/GraphCanvas.vue";
import NodeDetailsPanel from "../graph/NodeDetailsPanel.vue";
import CreateNodeModal from "../graph/CreateNodeModal.vue";

import { useGraphStore } from "../../stores/graphStore";

const graphStore = useGraphStore();

const showCreateNodeModal = ref(false);

const isTypingInField = (event: KeyboardEvent) => {
  const target = event.target as HTMLElement | null;

  if (!target) return false;

  return (
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT" ||
    target.isContentEditable
  );
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isTypingInField(event)) return;

  if (event.key.toLowerCase() === "n") {
    showCreateNodeModal.value = true;
  }

  if (event.key === "Escape") {
    showCreateNodeModal.value = false;
    graphStore.clearSelectedNode();
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown);
});
</script>