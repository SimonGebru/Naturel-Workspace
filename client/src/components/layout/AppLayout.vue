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
import { ref } from "vue";

import Sidebar from "./Sidebar.vue";
import Topbar from "./Topbar.vue";
import GraphCanvas from "../graph/GraphCanvas.vue";
import NodeDetailsPanel from "../graph/NodeDetailsPanel.vue";
import CreateNodeModal from "../graph/CreateNodeModal.vue";

const showCreateNodeModal = ref(false);
</script>