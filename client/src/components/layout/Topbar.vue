<template>
  <header
    class="h-16 border-b border-slate-800 bg-slate-950 px-6 flex items-center justify-between"
  >
    <div class="flex items-center gap-8">

      <div>
        <h2 class="text-lg font-semibold text-white">
          Graph
        </h2>

        <p class="text-xs text-slate-400">
          {{ nodeCount }} nodes • {{ connectionCount }} connections
        </p>
      </div>

      <input
  v-model="searchQuery"
  type="text"
  placeholder="Search nodes..."
  class="w-72 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm outline-none focus:border-violet-500"
/>

      <div class="flex gap-2">

        <button
          v-for="filter in filters"
          :key="filter"
          @click="selectedFilter = filter"
          :class="[
            'rounded-full px-3 py-1 text-xs transition',
            selectedFilter===filter
            ?'bg-violet-600 text-white'
            :'bg-slate-900 text-slate-400 hover:bg-slate-800'
          ]"
        >
          {{ filter }}
        </button>

      </div>

    </div>

    <div class="flex items-center gap-4">

      <span class="text-sm text-emerald-400">
        Saved
      </span>

      <button
        class="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium hover:bg-violet-500 transition"
        @click="$emit('open-create-node')"
      >
        Create Node
      </button>

    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useGraphStore } from "../../stores/graphStore";

const graphStore = useGraphStore();

const {
  selectedFilter,
  searchQuery,
  nodeCount,
  connectionCount
} = storeToRefs(graphStore);

const filters = [
  "all",
  "project",
  "task",
  "idea",
  "note",
  "tech",
];
</script>