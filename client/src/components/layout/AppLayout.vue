<template>
  <main class="h-screen overflow-hidden bg-slate-950 text-white">
    <div class="flex h-full bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(6,182,212,0.10),transparent_30%)]">
      <Sidebar />

      <section class="flex min-w-0 flex-1 flex-col">
        <Topbar @open-create-node="showCreateNodeModal = true" />

        <div class="min-h-0 flex-1 overflow-hidden">
          <RouterView />
        </div>
      </section>
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