<template>
  <main class="min-h-screen bg-slate-950 p-8 text-white">
    <div class="mb-6">
      <button
        class="rounded-xl bg-slate-900 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        @click="router.push('/workspace')"
      >
        ← Back to Graph
      </button>
    </div>

    <div class="mb-8">
      <h1 class="text-3xl font-bold">Settings</h1>

      <p class="mt-2 text-slate-400">
        Manage your profile and workspace preferences.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <section class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-sm uppercase tracking-wide text-violet-400">
          Profile
        </p>

        <div class="mt-5 space-y-4">
          <div>
            <p class="text-sm text-slate-500">Name</p>
            <p class="mt-1 text-lg font-medium">
              {{ authStore.user?.name || "Not set" }}
            </p>
          </div>

          <div>
            <p class="text-sm text-slate-500">Email</p>
            <p class="mt-1 text-lg font-medium">
              {{ authStore.user?.email || "Not set" }}
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <p class="text-sm uppercase tracking-wide text-cyan-400">
          Workspace
        </p>

        <div class="mt-5 space-y-4">
          <div>
            <p class="text-sm text-slate-500">Workspace name</p>
            <p class="mt-1 text-lg font-medium">
              My Neural Workspace
            </p>
          </div>

          <div>
            <p class="text-sm text-slate-500">Description</p>
            <p class="mt-1 text-slate-300">
              A graph-based space for projects, ideas, tasks and knowledge.
            </p>
          </div>
        </div>
      </section>

      <section class="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
        <p class="text-sm uppercase tracking-wide text-emerald-400">
          App status
        </p>

        <div class="mt-5 grid gap-4 md:grid-cols-3">
          <div class="rounded-xl bg-slate-950 p-4">
            <p class="text-sm text-slate-500">Frontend</p>
            <p class="mt-1 font-medium">Vue 3 + TypeScript</p>
          </div>

          <div class="rounded-xl bg-slate-950 p-4">
            <p class="text-sm text-slate-500">Backend</p>
            <p class="mt-1 font-medium">Node + Express</p>
          </div>

          <div class="rounded-xl bg-slate-950 p-4">
            <p class="text-sm text-slate-500">Database</p>
            <p class="mt-1 font-medium">MongoDB</p>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();
</script>