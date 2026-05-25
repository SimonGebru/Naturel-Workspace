<template>
  <aside class="w-80 border-l border-slate-800 bg-slate-950 p-6">
    <div v-if="!selectedNode && !selectedConnection">
      <h2 class="font-semibold">Details</h2>

      <p class="mt-4 text-sm text-slate-400">
        Select a node or connection to inspect details.
      </p>
    </div>

    <div v-else-if="selectedConnection">
      <p class="text-xs uppercase tracking-wide text-cyan-400">
        Connection
      </p>

      <h2 class="mt-1 text-xl font-semibold">
        {{ selectedConnection.label || selectedConnection.type }}
      </h2>

      <div class="mt-5 space-y-3 text-sm text-slate-300">
        <p>Type: <span class="text-slate-400">{{ selectedConnection.type }}</span></p>
        <p>Strength: <span class="text-slate-400">{{ selectedConnection.strength }}</span></p>
        <p>From: <span class="text-slate-400">{{ getNodeTitle(selectedConnection.sourceNode) }}</span></p>
        <p>To: <span class="text-slate-400">{{ getNodeTitle(selectedConnection.targetNode) }}</span></p>
      </div>

      <button
        type="button"
        class="mt-6 rounded-xl bg-red-600/80 px-4 py-2 text-sm hover:bg-red-500 transition"
        @click="handleDeleteConnection"
      >
        Delete Connection
      </button>
    </div>

    <div v-else-if="selectedNode">
      <input
        v-model="title"
        class="w-full rounded-xl bg-slate-900 p-3 text-lg font-semibold"
      />

      <textarea
        v-model="description"
        class="mt-4 h-32 w-full rounded-xl bg-slate-900 p-3"
      />

      <div class="mt-5 border-t border-slate-800 pt-4">
        <h3 class="text-sm font-medium text-slate-200">
          Related nodes
        </h3>

        <div v-if="relatedConnections.length" class="mt-3 space-y-2">
          <button
            v-for="connection in relatedConnections"
            :key="connection._id"
            type="button"
            class="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-left text-sm hover:border-cyan-500/50 transition"
            @click="graphStore.selectConnection(connection._id)"
          >
            <p class="text-cyan-300">
              {{ connection.label || connection.type }}
            </p>

            <p class="mt-1 text-xs text-slate-400">
              {{ getNodeTitle(connection.sourceNode) }}
              →
              {{ getNodeTitle(connection.targetNode) }}
            </p>
          </button>
        </div>

        <p v-else class="mt-3 text-sm text-slate-500">
          No related nodes yet.
        </p>
      </div>

      <div class="mt-6 flex gap-3">
        <button
          type="button"
          class="rounded-xl bg-violet-600 px-4 py-2 hover:bg-violet-500 transition"
          @click="handleSave"
        >
          Save
        </button>

        <button
          type="button"
          class="rounded-xl bg-red-600/80 px-4 py-2 hover:bg-red-500 transition"
          @click="handleDelete"
        >
          Delete
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";

import { useGraphStore } from "../../stores/graphStore";

const graphStore = useGraphStore();

const { selectedNode, selectedConnection, nodes } = storeToRefs(graphStore);

const title = ref("");
const description = ref("");

watch(
  selectedNode,
  (node) => {
    if (!node) return;

    title.value = node.title || "";
    description.value = node.description || "";
  },
  { immediate: true }
);

const getNodeTitle = (nodeRef: any) => {
  if (!nodeRef) return "Unknown";

  if (typeof nodeRef === "object" && nodeRef.title) {
    return nodeRef.title;
  }

  const node = nodes.value.find((item) => item._id === nodeRef);

  return node?.title || "Unknown";
};
const relatedConnections = computed(() => {
  if (!selectedNode.value) return [];

  return graphStore.connections.filter((connection: any) => {
    const sourceId =
      typeof connection.sourceNode === "string"
        ? connection.sourceNode
        : connection.sourceNode._id;

    const targetId =
      typeof connection.targetNode === "string"
        ? connection.targetNode
        : connection.targetNode._id;

    return (
      sourceId === selectedNode.value._id ||
      targetId === selectedNode.value._id
    );
  });
});

const handleSave = async () => {
  if (!selectedNode.value) return;

  await graphStore.updateExistingNode(selectedNode.value._id, {
    title: title.value,
    description: description.value,
  });
};

const handleDelete = async () => {
  if (!selectedNode.value) return;

  const confirmed = window.confirm(
    `Delete "${selectedNode.value.title}"? This will also remove its connections.`
  );

  if (!confirmed) return;

  await graphStore.deleteExistingNode(selectedNode.value._id);
};

const handleDeleteConnection = async () => {
  if (!selectedConnection.value) return;

  const confirmed = window.confirm(
    `Delete connection "${selectedConnection.value.label || selectedConnection.value.type}"?`
  );

  if (!confirmed) return;

  await graphStore.deleteExistingConnection(selectedConnection.value._id);
};
</script>