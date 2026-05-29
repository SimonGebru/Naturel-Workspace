<template>
  <aside class="w-[280px] border-r border-slate-800/80 bg-slate-950/95 text-white backdrop-blur-xl flex flex-col justify-between">
    <div>
      <div class="p-6">
        <div class="flex items-center gap-3">
          <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_30px_rgba(34,211,238,0.25)]">
            <span class="text-xl font-bold text-slate-950">
              N
            </span>
          </div>

          <div>
            <h1 class="text-lg font-bold leading-tight text-cyan-300">
              Neural
            </h1>

            <p class="text-sm font-medium text-slate-400">
              Workspace
            </p>
          </div>
        </div>

        <div class="mt-5 rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
          <p class="text-xs uppercase tracking-wide text-slate-500">
            Active workspace
          </p>

          <p class="mt-2 truncate text-sm font-medium text-slate-200">
            {{ workspaceStore.selectedWorkspace?.name || "No workspace selected" }}
          </p>
        </div>
      </div>

      <div class="px-4">
        <div class="mb-3 flex items-center justify-between px-1">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            My Workspaces
          </p>

          <button
            type="button"
            class="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-violet-300 hover:border-violet-500/40 hover:bg-violet-500/10 transition"
            @click="handleCreateWorkspace"
          >
            +
          </button>
        </div>

        <div class="mb-6 max-h-40 space-y-1 overflow-y-auto pr-1">
          <button
            v-for="workspace in workspaceStore.workspaces"
            :key="workspace._id"
            type="button"
            @click="workspaceStore.selectWorkspace(workspace)"
            :class="[
              'group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition',
              workspaceStore.selectedWorkspace?._id === workspace._id
                ? 'bg-violet-600/20 text-violet-100 shadow-[inset_3px_0_0_rgba(34,211,238,0.9)]'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            ]"
          >
            <span
              :class="[
                'h-2 w-2 rounded-full transition',
                workspaceStore.selectedWorkspace?._id === workspace._id
                  ? 'bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.9)]'
                  : 'bg-slate-600 group-hover:bg-slate-400'
              ]"
            />

            <span class="truncate">
              {{ workspace.name }}
            </span>
          </button>

          <p
            v-if="!workspaceStore.workspaces.length"
            class="rounded-xl border border-dashed border-slate-800 px-3 py-3 text-sm text-slate-500"
          >
            No workspaces yet
          </p>
        </div>
      </div>

      <nav class="border-t border-slate-800/80 px-4 pt-5 space-y-2">
        <RouterLink
          to="/workspace"
          class="sidebar-link"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">⌘</span>
          <span>Graph</span>
        </RouterLink>

        <RouterLink
          to="/nodes"
          class="sidebar-link"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">☷</span>
          <span>Nodes</span>
        </RouterLink>

        <button
          class="sidebar-link w-full cursor-not-allowed opacity-45"
          disabled
        >
          <span class="sidebar-icon">◌</span>
          <span>Archive</span>
        </button>

        <RouterLink
          to="/settings"
          class="sidebar-link"
          active-class="sidebar-link-active"
        >
          <span class="sidebar-icon">⚙</span>
          <span>Settings</span>
        </RouterLink>
      </nav>
    </div>

    <div class="space-y-4 border-t border-slate-800/80 p-4">
      <div class="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
        <div class="flex items-center gap-2">
          <span class="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />

          <p class="text-xs font-medium text-slate-300">
            Prototype
          </p>
        </div>

        <p class="mt-2 text-xs leading-5 text-slate-500">
          Connected to Node, Express and MongoDB.
        </p>
      </div>

      <div class="flex items-center gap-3 px-1">
        <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-violet-300">
          {{ userInitial }}
        </div>

        <div class="min-w-0">
          <p class="truncate text-sm font-medium text-slate-300">
            {{ authStore.user?.name || "User" }}
          </p>

          <p class="truncate text-xs text-slate-600">
            {{ authStore.user?.email || "Signed in" }}
          </p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { toast } from "vue-sonner";

import { useAuthStore } from "../../stores/authStore";
import { useWorkspaceStore } from "../../stores/workspaceStore";
import { useGraphStore } from "../../stores/graphStore";

const authStore = useAuthStore();
const workspaceStore = useWorkspaceStore();
const graphStore = useGraphStore();

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || "U";
});

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

<style scoped>
.sidebar-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  width: 100%;
  border-radius: 1rem;
  padding: 0.85rem 1rem;
  color: rgb(148 163 184);
  transition: 0.2s ease;
}

.sidebar-link:hover {
  background: rgba(15, 23, 42, 0.9);
  color: rgb(226 232 240);
}

.sidebar-link-active {
  background: rgba(15, 23, 42, 0.95);
  color: white;
  box-shadow:
    inset 3px 0 0 rgba(34, 211, 238, 0.95),
    0 0 28px rgba(15, 23, 42, 0.6);
}

.sidebar-icon {
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
  align-items: center;
  justify-content: center;
  color: rgb(148 163 184);
}
</style>