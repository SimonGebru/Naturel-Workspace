<template>
  <main class="h-full overflow-y-auto bg-[#020617] text-white">
    <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(139,92,246,0.16),transparent_28%),radial-gradient(circle_at_80%_80%,rgba(34,211,238,0.10),transparent_32%)]" />

    <section class="relative z-10 mx-auto max-w-5xl px-8 py-8">
      <div class="mb-10 flex items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-4">
            <h1 class="text-3xl font-bold tracking-tight">
              Settings
            </h1>

            <p class="text-sm text-slate-500">
              {{ graphStore.nodeCount }} nodes · {{ graphStore.connectionCount }} connections
            </p>
          </div>

          <p class="mt-2 text-sm text-slate-400">
            Manage your profile, workspace and project preferences.
          </p>
        </div>

        <button
          class="rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
          @click="router.push('/workspace')"
        >
          Back to graph
        </button>
      </div>

      <div class="space-y-6">
        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl">
          <div class="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 class="text-lg font-semibold">
                Profile
              </h2>

              <p class="mt-1 text-sm text-slate-500">
                Signed in user information.
              </p>
            </div>

            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-500/15 text-lg font-semibold text-violet-200">
              {{ userInitial }}
            </div>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Name</p>
              <p class="mt-2 font-medium text-slate-100">
                {{ authStore.user?.name || "Not set" }}
              </p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Email</p>
              <p class="mt-2 font-medium text-slate-100">
                {{ authStore.user?.email || "Not set" }}
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl">
          <div class="mb-6">
            <h2 class="text-lg font-semibold">
              Workspace
            </h2>

            <p class="mt-1 text-sm text-slate-500">
              Current workspace overview.
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Workspace name</p>
              <p class="mt-2 font-medium text-slate-100">
                {{ workspaceStore.selectedWorkspace?.name || "No workspace selected" }}
              </p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Stats</p>
              <p class="mt-2 font-medium text-slate-100">
                {{ graphStore.nodeCount }} nodes · {{ graphStore.connectionCount }} connections
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl">
          <h2 class="text-lg font-semibold">
            App status
          </h2>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Frontend</p>
              <p class="mt-2 font-medium text-slate-100">
                Vue 3 + TypeScript
              </p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Backend</p>
              <p class="mt-2 font-medium text-slate-100">
                Node + Express
              </p>
            </div>

            <div class="rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <p class="text-sm text-slate-500">Database</p>
              <p class="mt-2 font-medium text-slate-100">
                MongoDB
              </p>
            </div>
          </div>
        </section>

        <section class="rounded-3xl border border-slate-800 bg-slate-900/70 p-7 backdrop-blur-xl">
          <h2 class="text-lg font-semibold">
            Shortcuts
          </h2>

          <div class="mt-6 space-y-4">
            <div class="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <span class="text-sm text-slate-400">New node</span>
              <kbd class="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">N</kbd>
            </div>

            <div class="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/70 p-5">
              <span class="text-sm text-slate-400">Close panel / modal</span>
              <kbd class="rounded-lg bg-slate-800 px-3 py-1 text-xs text-slate-300">Esc</kbd>
            </div>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/authStore";
import { useGraphStore } from "../stores/graphStore";
import { useWorkspaceStore } from "../stores/workspaceStore";

const router = useRouter();
const authStore = useAuthStore();
const graphStore = useGraphStore();
const workspaceStore = useWorkspaceStore();

const userInitial = computed(() => {
  return authStore.user?.name?.charAt(0)?.toUpperCase() || "U";
});

onMounted(() => {
  graphStore.fetchGraph();
});
</script>