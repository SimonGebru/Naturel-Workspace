<template>
  <div class="flex h-full min-h-0 overflow-hidden">
    <GraphCanvas />

    <NodeDetailsPanel />
  </div>
</template>

<script setup lang="ts">
import GraphCanvas from "../components/graph/GraphCanvas.vue";
import NodeDetailsPanel from "../components/graph/NodeDetailsPanel.vue";
</script>