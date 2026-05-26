<template>
  <aside class="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between">
    <div>
      <div class="p-6">
        <h1 class="text-xl font-bold text-violet-400">
          Neural Workspace
        </h1>

        <p class="mt-1 text-sm text-slate-400">
          {{ workspaceStore.selectedWorkspace?.name || "No workspace selected" }}
        </p>
      </div>

      <div class="px-3">
        <div class="mb-3 flex items-center justify-between px-1">
          <p class="text-xs uppercase tracking-wide text-slate-500">
            My Workspaces
          </p>

          <button
            class="rounded-md px-2 py-1 text-sm text-violet-300 hover:bg-slate-900"
            @click="handleCreateWorkspace"
          >
            +
          </button>
        </div>

        <div class="mb-5 space-y-1">
          <button
            v-for="workspace in workspaceStore.workspaces"
            :key="workspace._id"
            type="button"
            @click="workspaceStore.selectWorkspace(workspace)"
            :class="[
              'w-full rounded-lg px-3 py-2 text-left text-sm transition',
              workspaceStore.selectedWorkspace?._id === workspace._id
                ? 'bg-violet-600/20 text-violet-200'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            ]"
          >
            {{ workspace.name }}
          </button>

          <p
            v-if="!workspaceStore.workspaces.length"
            class="px-3 py-2 text-sm text-slate-500"
          >
            No workspaces yet
          </p>
        </div>
      </div>

      <nav class="border-t border-slate-800 px-3 pt-4 space-y-2">
        <RouterLink
          to="/workspace"
          class="block w-full rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition"
        >
          Graph
        </RouterLink>

        <RouterLink
          to="/nodes"
          class="block w-full rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition"
        >
          Nodes
        </RouterLink>

        <button
          class="w-full rounded-lg px-4 py-3 text-left text-slate-500 cursor-not-allowed"
          disabled
        >
          Archive
        </button>

        <RouterLink
          to="/settings"
          class="block w-full rounded-lg px-4 py-3 text-left text-slate-300 hover:bg-slate-900 transition"
        >
          Settings
        </RouterLink>
      </nav>
    </div>

    <div class="border-t border-slate-800 p-4">
      <div class="text-sm text-slate-400">
        {{ authStore.user?.name || "User" }}
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { toast } from "vue-sonner";

import { useAuthStore } from "../../stores/authStore";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import { useGraphStore } from "../../stores/graphStore";

const authStore = useAuthStore();
const workspaceStore = useWorkspaceStore();
const graphStore = useGraphStore();

onMounted(async () => {
  await workspaceStore.fetchWorkspaces();

  if (workspaceStore.selectedWorkspace?._id) {
    graphStore.fetchGraph();
  }
});

watch(
  () => workspaceStore.selectedWorkspace?._id,
  () => {
    graphStore.clearSelectedNode();
    graphStore.fetchGraph();
  }
);

const handleCreateWorkspace = async () => {
  const name = window.prompt("Workspace name");

  if (!name) return;

  await workspaceStore.createWorkspace({
    name,
    description: "",
  });

  await graphStore.fetchGraph();

  toast.success("Workspace created");
};
</script>