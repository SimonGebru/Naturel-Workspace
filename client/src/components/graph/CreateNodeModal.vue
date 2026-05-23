<template>
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
  >
    <div class="w-[500px] rounded-2xl bg-slate-900 p-6 border border-slate-700">

      <h2 class="text-xl font-semibold">
        Create Node
      </h2>

      <div class="mt-6 space-y-4">

        <input
          v-model="title"
          placeholder="Title"
          class="w-full rounded-lg bg-slate-800 p-3"
        />

        <select
          v-model="type"
          class="w-full rounded-lg bg-slate-800 p-3"
        >
          <option value="project">Project</option>
          <option value="idea">Idea</option>
          <option value="note">Note</option>
          <option value="task">Task</option>
          <option value="goal">Goal</option>
          <option value="tech">Tech</option>
          <option value="code">Code</option>
        </select>

        <textarea
          v-model="description"
          placeholder="Description"
          class="w-full rounded-lg bg-slate-800 p-3"
        />

      </div>

      <div class="mt-6 flex justify-end gap-3">

        <button
          class="px-4 py-2 rounded-lg bg-slate-700"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="px-4 py-2 rounded-lg bg-violet-600"
          @click="handleCreate"
        >
          Create
        </button>

      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGraphStore } from "../../stores/graphStore";

const emit = defineEmits(["close"]);

const graphStore = useGraphStore();

const title = ref("");
const type = ref("project");
const description = ref("");

const handleCreate = async () => {
  await graphStore.createNewNode({
    title: title.value,
    type: type.value,
    description: description.value,
    tags: [],
    color: "#7c3aed",
    position: {
      x: Math.random() * 600,
      y: Math.random() * 400,
    },
  });

  emit("close");
};
</script>