<template>
  <aside class="w-[380px] border-l border-slate-800 bg-slate-950 text-white">
    <div v-if="!selectedNode && !selectedConnection" class="flex h-full flex-col items-center justify-center p-8 text-center">
      <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-400">
        ⌁
      </div>

      <h2 class="text-lg font-semibold">No selection</h2>

      <p class="mt-3 max-w-56 text-sm leading-6 text-slate-500">
        Click a node or connection to inspect and edit details.
      </p>
    </div>

    <div v-else-if="selectedConnection" class="flex h-full flex-col">
      <div class="border-b border-slate-800 p-6">
        <div class="flex items-center justify-between">
          <p class="text-xs uppercase tracking-wide text-cyan-400">
            Connection
          </p>

          <button
            type="button"
            class="text-slate-500 hover:text-white"
            @click="graphStore.clearSelectedConnection()"
          >
            ×
          </button>
        </div>

        <h2 class="mt-3 text-2xl font-semibold">
          {{ selectedConnection.label || selectedConnection.type }}
        </h2>
      </div>

      <div class="flex-1 space-y-5 overflow-y-auto p-6">
        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p class="text-xs text-slate-500">Type</p>
          <p class="mt-1 text-sm text-slate-200">
            {{ selectedConnection.type }}
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p class="text-xs text-slate-500">Strength</p>
          <p class="mt-1 text-sm text-slate-200">
            {{ selectedConnection.strength }}
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p class="text-xs text-slate-500">From</p>
          <p class="mt-1 text-sm text-slate-200">
            {{ getNodeTitle(selectedConnection.sourceNode) }}
          </p>
        </div>

        <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p class="text-xs text-slate-500">To</p>
          <p class="mt-1 text-sm text-slate-200">
            {{ getNodeTitle(selectedConnection.targetNode) }}
          </p>
        </div>
      </div>

      <div class="border-t border-slate-800 p-6">
        <button
          type="button"
          class="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 transition"
          @click="handleDeleteConnection"
        >
          Delete connection
        </button>
      </div>
    </div>

    <div v-else-if="selectedNode" class="flex h-full flex-col">
      <div class="border-b border-slate-800 p-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span :class="['h-2.5 w-2.5 rounded-full', nodeTypeDotClass]" />

            <p :class="['text-xs uppercase tracking-wide', nodeTypeTextClass]">
              {{ selectedNode.type }}
            </p>
          </div>

          <button
            type="button"
            class="text-slate-500 hover:text-white"
            @click="graphStore.clearSelectedNode()"
          >
            ×
          </button>
        </div>

        <h2 class="mt-3 text-2xl font-semibold">
          {{ selectedNode.title }}
        </h2>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <div class="space-y-5">
          <div>
            <label class="text-sm text-slate-400">Title</label>

            <input
              v-model="title"
              class="mt-2 w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm outline-none transition focus:border-violet-500"
            />
          </div>

          <div>
            <label class="text-sm text-slate-400">Description</label>

            <textarea
              v-model="description"
              class="mt-2 h-36 w-full resize-none rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm leading-6 outline-none transition focus:border-violet-500"
              placeholder="Write something about this node..."
            />
          </div>

          <div>
            <label class="text-sm text-slate-400">Type</label>

            <div class="mt-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              {{ selectedNode.type }}
            </div>
          </div>

          <div class="border-t border-slate-800 pt-5">
            <h3 class="text-sm font-medium text-slate-200">
              Connections
            </h3>

            <div v-if="relatedConnections.length" class="mt-3 space-y-2">
              <button
                v-for="connection in relatedConnections"
                :key="connection._id"
                type="button"
                class="w-full rounded-xl border border-slate-800 bg-slate-900/70 p-3 text-left text-sm hover:border-cyan-500/50 hover:bg-slate-900 transition"
                @click="graphStore.selectConnection(connection._id)"
              >
                <p class="text-cyan-300">
                  {{ connection.label || connection.type }}
                </p>

                <p class="mt-1 text-xs text-slate-500">
                  {{ getNodeTitle(connection.sourceNode) }}
                  →
                  {{ getNodeTitle(connection.targetNode) }}
                </p>
              </button>
            </div>

            <p v-else class="mt-3 text-sm text-slate-500">
              No connections yet.
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-3 border-t border-slate-800 p-6">
        <button
          type="button"
          class="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium hover:bg-violet-500 transition"
          @click="handleSave"
        >
          Save changes
        </button>

        <button
          type="button"
          class="w-full rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-300 hover:bg-red-500/20 transition"
          @click="handleDelete"
        >
          Delete node
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

const nodeTypeStyles: Record<string, { dot: string; text: string }> = {
  project: {
    dot: "bg-red-400",
    text: "text-red-300",
  },
  idea: {
    dot: "bg-yellow-400",
    text: "text-yellow-300",
  },
  task: {
    dot: "bg-green-400",
    text: "text-green-300",
  },
  note: {
    dot: "bg-cyan-400",
    text: "text-cyan-300",
  },
  tech: {
    dot: "bg-violet-400",
    text: "text-violet-300",
  },
  code: {
    dot: "bg-violet-400",
    text: "text-violet-300",
  },
  goal: {
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
};

const currentNodeTypeStyle = computed(() => {
  if (!selectedNode.value) {
    return nodeTypeStyles.project;
  }

  return nodeTypeStyles[selectedNode.value.type] || nodeTypeStyles.project;
});

const nodeTypeDotClass = computed(() => currentNodeTypeStyle.value.dot);

const nodeTypeTextClass = computed(() => currentNodeTypeStyle.value.text);

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