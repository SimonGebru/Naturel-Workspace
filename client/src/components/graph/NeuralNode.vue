<template>
  <div
    :class="[
      'group relative w-[280px] overflow-hidden rounded-3xl border bg-slate-950/75 p-5 text-white shadow-2xl backdrop-blur-xl transition-all duration-300',
      nodeStyle.border,
      nodeStyle.glow
    ]"
  >
    <div
      :class="[
        'pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100',
        nodeStyle.surface
      ]"
    />

    <Handle
      type="target"
      :position="Position.Left"
      class="!h-3.5 !w-3.5 !border-2 !border-slate-950 !bg-cyan-300 !shadow-[0_0_14px_rgba(34,211,238,0.9)]"
    />

    <Handle
      type="source"
      :position="Position.Right"
      class="!h-3.5 !w-3.5 !border-2 !border-slate-950 !bg-cyan-300 !shadow-[0_0_14px_rgba(34,211,238,0.9)]"
    />

    <div class="relative z-10">
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span :class="['h-2.5 w-2.5 rounded-full shadow-lg', nodeStyle.dot]" />

          <span
            :class="[
              'rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]',
              nodeStyle.badge
            ]"
          >
            {{ data.nodeType }}
          </span>
        </div>

        <span class="text-xs text-slate-600">
          node
        </span>
      </div>

      <h3 class="mt-5 text-base font-semibold leading-snug tracking-tight text-white">
        {{ data.label }}
      </h3>

      <p
        v-if="data.description"
        class="mt-3 line-clamp-3 text-xs leading-5 text-slate-400"
      >
        {{ data.description }}
      </p>

      <p
        v-else
        class="mt-3 text-xs italic text-slate-600"
      >
        No description yet
      </p>

      <div class="mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3">
        <span class="text-[11px] text-slate-500">
          Click to inspect
        </span>

        <span :class="['h-1.5 w-10 rounded-full', nodeStyle.bar]" />
      </div>
    </div>
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
    border: "border-red-500/45",
    glow: "shadow-[0_0_42px_rgba(239,68,68,0.26)] hover:shadow-[0_0_55px_rgba(239,68,68,0.36)]",
    dot: "bg-red-400 shadow-red-500/80",
    badge: "border-red-500/30 bg-red-500/15 text-red-200",
    bar: "bg-red-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(239,68,68,0.18),transparent_42%)]",
  },
  idea: {
    border: "border-yellow-500/45",
    glow: "shadow-[0_0_42px_rgba(250,204,21,0.24)] hover:shadow-[0_0_55px_rgba(250,204,21,0.34)]",
    dot: "bg-yellow-400 shadow-yellow-500/80",
    badge: "border-yellow-500/30 bg-yellow-500/15 text-yellow-200",
    bar: "bg-yellow-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.16),transparent_42%)]",
  },
  task: {
    border: "border-green-500/45",
    glow: "shadow-[0_0_42px_rgba(34,197,94,0.24)] hover:shadow-[0_0_55px_rgba(34,197,94,0.34)]",
    dot: "bg-green-400 shadow-green-500/80",
    badge: "border-green-500/30 bg-green-500/15 text-green-200",
    bar: "bg-green-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_42%)]",
  },
  note: {
    border: "border-cyan-500/45",
    glow: "shadow-[0_0_42px_rgba(6,182,212,0.24)] hover:shadow-[0_0_55px_rgba(6,182,212,0.34)]",
    dot: "bg-cyan-400 shadow-cyan-500/80",
    badge: "border-cyan-500/30 bg-cyan-500/15 text-cyan-200",
    bar: "bg-cyan-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(6,182,212,0.16),transparent_42%)]",
  },
  tech: {
    border: "border-violet-500/45",
    glow: "shadow-[0_0_42px_rgba(168,85,247,0.26)] hover:shadow-[0_0_55px_rgba(168,85,247,0.36)]",
    dot: "bg-violet-400 shadow-violet-500/80",
    badge: "border-violet-500/30 bg-violet-500/15 text-violet-200",
    bar: "bg-violet-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.18),transparent_42%)]",
  },
  code: {
    border: "border-fuchsia-500/45",
    glow: "shadow-[0_0_42px_rgba(217,70,239,0.24)] hover:shadow-[0_0_55px_rgba(217,70,239,0.34)]",
    dot: "bg-fuchsia-400 shadow-fuchsia-500/80",
    badge: "border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-200",
    bar: "bg-fuchsia-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(217,70,239,0.16),transparent_42%)]",
  },
  goal: {
    border: "border-emerald-500/45",
    glow: "shadow-[0_0_42px_rgba(16,185,129,0.24)] hover:shadow-[0_0_55px_rgba(16,185,129,0.34)]",
    dot: "bg-emerald-400 shadow-emerald-500/80",
    badge: "border-emerald-500/30 bg-emerald-500/15 text-emerald-200",
    bar: "bg-emerald-400",
    surface: "bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.16),transparent_42%)]",
  },
};

const nodeStyle = computed(() => {
  return styles[props.data.nodeType] || styles.tech;
});
</script>