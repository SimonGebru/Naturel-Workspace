<template>
  <main class="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
    <section class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl">
      <p class="text-sm font-medium text-violet-400">
        Neural Workspace
      </p>

      <h1 class="mt-3 text-3xl font-bold">
        Create account
      </h1>

      <p class="mt-2 text-sm text-slate-400">
        Start building your visual workspace.
      </p>

      <form class="mt-8 space-y-4" @submit.prevent="handleRegister">
        <input
          v-model="name"
          type="text"
          placeholder="Name"
          class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
        />

        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-violet-500"
        />

        <button
          type="submit"
          class="w-full rounded-xl bg-violet-600 px-4 py-3 text-sm font-medium hover:bg-violet-500 transition disabled:opacity-60"
          :disabled="authStore.loading"
        >
          {{ authStore.loading ? "Creating account..." : "Register" }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-slate-400">
        Already have an account?
        <RouterLink to="/login" class="text-violet-400 hover:text-violet-300">
          Login
        </RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { useAuthStore } from "../stores/authStore";

const router = useRouter();
const authStore = useAuthStore();

const name = ref("");
const email = ref("");
const password = ref("");

const handleRegister = async () => {
  try {
    await authStore.registerUser({
      name: name.value,
      email: email.value,
      password: password.value,
    });

    toast.success("Account created");
    router.push("/workspace");
  } catch (error) {
    console.error(error);
    toast.error("Registration failed");
  }
};
</script>