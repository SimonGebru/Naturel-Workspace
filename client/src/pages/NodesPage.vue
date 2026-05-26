<template>
  <div class="min-h-screen bg-slate-950 p-8 text-white">
    <div class="mb-6">
      <button
        class="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        @click="router.push('/workspace')"
      >
        ← Back to Graph
      </button>
    </div>

    <div class="mb-8">
      <h1 class="text-3xl font-bold">Nodes</h1>

      <p class="mt-2 text-slate-400">
        Browse all nodes in your workspace
      </p>
    </div>

    <div class="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search nodes..."
        class="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-sm outline-none focus:border-violet-500 md:max-w-md"
      />

      <div class="flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter"
          type="button"
          @click="selectedFilter = filter"
          :class="[
            'rounded-full px-4 py-2 text-xs transition',
            selectedFilter === filter
              ? 'bg-violet-600 text-white'
              : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
          ]"
        >
          {{ filter }}
        </button>
      </div>
    </div>

    <div v-if="graphStore.loading" class="text-slate-400">
      Loading nodes...
    </div>

    <div
      v-else-if="!graphStore.filteredNodes.length"
      class="rounded-2xl border border-slate-800 bg-slate-900 p-8 text-slate-400"
    >
      No nodes found.
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="node in graphStore.filteredNodes"
        :key="node._id"
        class="cursor-pointer rounded-2xl border border-slate-800 bg-slate-900 p-5 transition hover:border-violet-500 hover:bg-slate-800"
        @click="openNode(node._id)"
      >
        <div class="mb-3 inline-flex rounded-full bg-violet-500/20 px-3 py-1 text-xs text-violet-300">
          {{ node.type }}
        </div>

        <h2 class="font-semibold">
          {{ node.title }}
        </h2>

        <p class="mt-2 text-sm text-slate-400 line-clamp-3">
          {{ node.description || "No description yet." }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useGraphStore } from "../stores/graphStore";

const graphStore = useGraphStore();
const router = useRouter();

const { searchQuery, selectedFilter } = storeToRefs(graphStore);

const filters = [
  "all",
  "project",
  "task",
  "idea",
  "note",
  "tech",
  "code",
  "goal",
];

onMounted(() => {
  graphStore.fetchGraph();
});

const openNode = (nodeId: string) => {
  graphStore.selectNode(nodeId);
  router.push("/workspace");
};
</script>