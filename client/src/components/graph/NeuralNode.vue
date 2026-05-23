<template>
  <div
    :class="[
      'min-w-[220px] rounded-2xl border p-4 backdrop-blur-md transition-all duration-300',
      nodeStyle.border,
      nodeStyle.glow
    ]"
  >
    <Handle
      type="target"
      :position="Position.Left"
      class="!h-3 !w-3 !border !border-slate-950 !bg-cyan-400"
    />

    <Handle
      type="source"
      :position="Position.Right"
      class="!h-3 !w-3 !border !border-slate-950 !bg-cyan-400"
    />

    <div class="flex items-center gap-2">
      <div :class="['h-2 w-2 rounded-full', nodeStyle.dot]" />

      <span
        :class="[
          'rounded-full px-2 py-1 text-[10px] uppercase tracking-wider',
          nodeStyle.badge
        ]"
      >
        {{ data.nodeType }}
      </span>
    </div>

    <h3 class="mt-3 text-sm font-semibold text-white">
      {{ data.label }}
    </h3>

    <p
      v-if="data.description"
      class="mt-2 text-xs text-slate-400 line-clamp-2"
    >
      {{ data.description }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { Handle, Position } from "@vue-flow/core";

const props = defineProps<{
  data: any;
}>();

const styles: Record<string, any> = {
  project: {
    border: "border-red-500/40",
    glow: "shadow-[0_0_30px_rgba(239,68,68,0.25)]",
    dot: "bg-red-400",
    badge: "bg-red-500/20 text-red-300",
  },
  idea: {
    border: "border-yellow-500/40",
    glow: "shadow-[0_0_30px_rgba(250,204,21,0.25)]",
    dot: "bg-yellow-400",
    badge: "bg-yellow-500/20 text-yellow-300",
  },
  task: {
    border: "border-green-500/40",
    glow: "shadow-[0_0_30px_rgba(34,197,94,0.25)]",
    dot: "bg-green-400",
    badge: "bg-green-500/20 text-green-300",
  },
  note: {
    border: "border-cyan-500/40",
    glow: "shadow-[0_0_30px_rgba(6,182,212,0.25)]",
    dot: "bg-cyan-400",
    badge: "bg-cyan-500/20 text-cyan-300",
  },
  tech: {
    border: "border-violet-500/40",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    dot: "bg-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
  },
  code: {
    border: "border-violet-500/40",
    glow: "shadow-[0_0_30px_rgba(168,85,247,0.25)]",
    dot: "bg-violet-400",
    badge: "bg-violet-500/20 text-violet-300",
  },
};

const nodeStyle = computed(() => {
  return styles[props.data.nodeType] || styles.tech;
});
</script>