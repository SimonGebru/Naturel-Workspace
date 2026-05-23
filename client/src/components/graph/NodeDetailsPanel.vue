<template>
  <aside
    class="w-80 border-l border-slate-800 bg-slate-950 p-6"
  >
    <div v-if="!selectedNode">
      <h2 class="font-semibold">
        Node Details
      </h2>

      <p class="mt-4 text-sm text-slate-400">
        Select a node to inspect details
      </p>
    </div>

    <div v-else>

      <input
        v-model="title"
        class="w-full rounded-xl bg-slate-900 p-3 text-lg font-semibold"
      />

      <textarea
        v-model="description"
        class="mt-4 h-32 w-full rounded-xl bg-slate-900 p-3"
      />

      <div class="mt-6 flex gap-3">

        <button
          class="rounded-xl bg-violet-600 px-4 py-2"
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
import {
  ref,
  watch
} from "vue";

import {
  storeToRefs
} from "pinia";

import {
  useGraphStore
} from "../../stores/graphStore";

const graphStore =
  useGraphStore();

const {
  selectedNode
} = storeToRefs(graphStore);

const title =
  ref("");

const description =
  ref("");

watch(
  selectedNode,
  (node) => {

    if (!node) return;

    title.value =
      node.title || "";

    description.value =
      node.description || "";

  },
  {
    immediate:true
  }
);

const handleSave =
async () => {

  if (
    !selectedNode.value
  ) return;

  await graphStore
    .updateExistingNode(
      selectedNode.value._id,
      {
        title:title.value,
        description:
        description.value
      }
    );

};
const handleDelete = async () => {
  if (!selectedNode.value) return;

  const confirmed = window.confirm(
    `Delete "${selectedNode.value.title}"? This will also remove its connections.`
  );

  if (!confirmed) return;

  await graphStore.deleteExistingNode(selectedNode.value._id);
};
</script>