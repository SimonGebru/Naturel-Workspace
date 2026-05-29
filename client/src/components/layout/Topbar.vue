<template>
  <header
    class="h-20 border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-xl"
  >
    <div class="flex h-full items-center justify-between gap-6">
      <div class="min-w-[180px]">
        <div class="flex items-center gap-3">
          <h2 class="text-xl font-semibold tracking-tight text-white">
            Graph
          </h2>

          <span class="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
            Live
          </span>
        </div>

        <p class="mt-1 text-xs text-slate-500">
          {{ nodeCount }} nodes • {{ connectionCount }} connections
        </p>
      </div>

      <div class="flex min-w-0 flex-1 items-center justify-center gap-3">
        <div class="relative w-full max-w-xl">
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
            /
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search nodes..."
            class="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-3 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:bg-slate-900"
          />
        </div>

        <div class="hidden items-center gap-2 xl:flex">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            @click="selectedFilter = filter"
            :class="[
              'rounded-full border px-3 py-2 text-xs font-medium capitalize transition',
              selectedFilter === filter
                ? 'border-violet-500/40 bg-violet-500/20 text-violet-200 shadow-[0_0_22px_rgba(139,92,246,0.22)]'
                : 'border-slate-800 bg-slate-900/70 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            ]"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <button
          class="rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          @click="handleLogout"
        >
          Logout
        </button>

        <button
          class="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_28px_rgba(124,58,237,0.38)] transition hover:bg-violet-500 hover:shadow-[0_0_36px_rgba(124,58,237,0.55)]"
          @click="$emit('open-create-node')"
        >
          New Node
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

import { useGraphStore } from "../../stores/graphStore";
import { useAuthStore } from "../../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
const graphStore = useGraphStore();

const {
  selectedFilter,
  searchQuery,
  nodeCount,
  connectionCount,
} = storeToRefs(graphStore);

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

const handleLogout = () => {
  authStore.logout();

  router.push("/login");
};
</script>