<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
    <div class="w-[420px] rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
      <h2 class="text-xl font-semibold text-white">
        Create Connection
      </h2>

      <p class="mt-2 text-sm text-slate-400">
        Choose how these nodes are related.
      </p>

      <select
        v-model="type"
        class="mt-6 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white outline-none"
      >
        <option value="related_to">Related to</option>
        <option value="depends_on">Depends on</option>
        <option value="part_of">Part of</option>
        <option value="inspired_by">Inspired by</option>
        <option value="blocks">Blocks</option>
        <option value="supports">Supports</option>
      </select>

      <input
        v-model="label"
        placeholder="Label, for example: uses database"
        class="mt-4 w-full rounded-xl border border-slate-700 bg-slate-800 p-3 text-sm text-white outline-none"
      />

      <div class="mt-6 flex justify-end gap-3">
        <button
          class="rounded-xl bg-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-600"
          @click="$emit('close')"
        >
          Cancel
        </button>

        <button
          class="rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
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

const props = defineProps<{
  sourceNode: string;
  targetNode: string;
}>();

const emit = defineEmits(["close"]);

const graphStore = useGraphStore();

const type = ref("related_to");
const label = ref("");

const handleCreate = async () => {
  await graphStore.createNewConnection(
    props.sourceNode,
    props.targetNode,
    type.value,
    label.value || type.value
  );

  emit("close");
};
</script>