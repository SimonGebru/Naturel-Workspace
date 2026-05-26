import { defineStore } from "pinia";
import { ref } from "vue";

import api from "../services/api";

export const useWorkspaceStore = defineStore(
  "workspace",
  () => {

    const workspaces = ref([]);
    const selectedWorkspace = ref(null);

    const loading = ref(false);

    const fetchWorkspaces = async () => {

      loading.value = true;

      try {

        const response =
          await api.get(
            "/workspaces"
          );

        workspaces.value =
          response.data.workspaces;

        if (
          !selectedWorkspace.value &&
          workspaces.value.length
        ) {

          selectedWorkspace.value =
            workspaces.value[0];

        }

      } finally {

        loading.value = false;

      }

    };

    const createWorkspace = async (
      workspaceData:any
    ) => {

      const response =
        await api.post(
          "/workspaces",
          workspaceData
        );

      workspaces.value.unshift(
        response.data.workspace
      );

      selectedWorkspace.value =
        response.data.workspace;

    };

    const selectWorkspace = (
      workspace:any
    ) => {

      selectedWorkspace.value =
        workspace;

    };

    return {
      workspaces,
      selectedWorkspace,
      loading,
      fetchWorkspaces,
      createWorkspace,
      selectWorkspace,
    };

  }
);