<template>
  <main class="h-full overflow-y-auto bg-[#020617] text-white">
    <div class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.10),transparent_32%)]" />

    <section class="relative z-10 mx-auto max-w-7xl px-8 py-8">
      <div class="mb-10 flex items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold tracking-tight">
              Nodes
            </h1>

            <p class="text-sm text-slate-500">
              {{ graphStore.nodeCount }} nodes · {{ graphStore.connectionCount }} connections
            </p>
          </div>

          <p class="mt-2 text-sm text-slate-400">
            Browse, filter and inspect all nodes in your workspace.
          </p>
        </div>

        <button
          class="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          @click="router.push('/workspace')"
        >
          Back to graph
        </button>
      </div>

      <div class="mb-8 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div class="relative w-full max-w-xl">
          <span class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
            /
          </span>

          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter nodes..."
            class="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-4 pl-10 pr-4 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-violet-500/70 focus:bg-slate-900"
          />
        </div>

        <div class="flex flex-wrap gap-2">
          <button
            v-for="filter in filters"
            :key="filter"
            type="button"
            @click="selectedFilter = filter"
            :class="[
              'rounded-full border px-4 py-2 text-xs font-medium capitalize transition',
              selectedFilter === filter
                ? 'border-violet-500/40 bg-violet-500/20 text-violet-200 shadow-[0_0_22px_rgba(139,92,246,0.22)]'
                : 'border-slate-800 bg-slate-900/70 text-slate-500 hover:border-slate-700 hover:text-slate-300'
            ]"
          >
            {{ filter }}
          </button>
        </div>
      </div>

      <div
        v-if="graphStore.loading"
        class="rounded-3xl border border-slate-800 bg-slate-900/70 p-10 text-slate-400"
      >
        Loading nodes...
      </div>

      <div
        v-else-if="!graphStore.filteredNodes.length"
        class="rounded-3xl border border-dashed border-slate-800 bg-slate-900/50 p-12 text-center"
      >
        <h2 class="text-xl font-semibold">
          No nodes found
        </h2>

        <p class="mt-3 text-sm text-slate-500">
          Try another filter or create a new node from the graph view.
        </p>
      </div>

      <div v-else class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <button
          v-for="node in graphStore.filteredNodes"
          :key="node._id"
          type="button"
          :class="[
            'group min-h-[160px] rounded-3xl border bg-slate-900/70 p-6 text-left backdrop-blur-xl transition-all duration-300 hover:-translate-y-1',
            getNodeStyle(node.type).border,
            getNodeStyle(node.type).glow
          ]"
          @click="openNode(node._id)"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex items-center gap-3">
              <span
                :class="[
                  'flex h-9 w-9 items-center justify-center rounded-2xl border text-xs font-semibold uppercase',
                  getNodeStyle(node.type).icon
                ]"
              >
                {{ getNodeInitial(node.type) }}
              </span>

              <div>
                <p
                  :class="[
                    'text-xs font-semibold uppercase tracking-[0.18em]',
                    getNodeStyle(node.type).text
                  ]"
                >
                  {{ node.type }}
                </p>
              </div>
            </div>
          </div>

          <h2 class="mt-5 text-lg font-semibold leading-snug text-white">
            {{ node.title }}
          </h2>

          <p class="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">
            {{ node.description || "No description yet." }}
          </p>

          <div class="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-4">
            <span class="text-xs text-slate-500">
              Click to inspect
            </span>

            <span
              :class="[
                'h-1.5 w-12 rounded-full',
                getNodeStyle(node.type).bar
              ]"
            />
          </div>
        </button>
      </div>
    </section>
  </main>
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

const nodeStyles: Record<string, any> = {
  project: {
    border: "border-red-500/30 hover:border-red-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(239,68,68,0.22)]",
    icon: "border-red-500/30 bg-red-500/15 text-red-200",
    text: "text-red-300",
    bar: "bg-red-400",
  },
  idea: {
    border: "border-yellow-500/30 hover:border-yellow-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(250,204,21,0.20)]",
    icon: "border-yellow-500/30 bg-yellow-500/15 text-yellow-200",
    text: "text-yellow-300",
    bar: "bg-yellow-400",
  },
  task: {
    border: "border-green-500/30 hover:border-green-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(34,197,94,0.20)]",
    icon: "border-green-500/30 bg-green-500/15 text-green-200",
    text: "text-green-300",
    bar: "bg-green-400",
  },
  note: {
    border: "border-cyan-500/30 hover:border-cyan-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(6,182,212,0.20)]",
    icon: "border-cyan-500/30 bg-cyan-500/15 text-cyan-200",
    text: "text-cyan-300",
    bar: "bg-cyan-400",
  },
  tech: {
    border: "border-violet-500/30 hover:border-violet-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(168,85,247,0.22)]",
    icon: "border-violet-500/30 bg-violet-500/15 text-violet-200",
    text: "text-violet-300",
    bar: "bg-violet-400",
  },
  code: {
    border: "border-fuchsia-500/30 hover:border-fuchsia-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(217,70,239,0.20)]",
    icon: "border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-200",
    text: "text-fuchsia-300",
    bar: "bg-fuchsia-400",
  },
  goal: {
    border: "border-emerald-500/30 hover:border-emerald-400/60",
    glow: "hover:shadow-[0_0_45px_rgba(16,185,129,0.20)]",
    icon: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
    text: "text-emerald-300",
    bar: "bg-emerald-400",
  },
};

const getNodeStyle = (type: string) => {
  return nodeStyles[type] || nodeStyles.tech;
};

const getNodeInitial = (type: string) => {
  return type?.charAt(0)?.toUpperCase() || "N";
};

onMounted(() => {
  graphStore.fetchGraph();
});

const openNode = (nodeId: string) => {
  graphStore.selectNode(nodeId);
  router.push("/workspace");
};
</script>