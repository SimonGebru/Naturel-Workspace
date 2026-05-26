import { defineStore } from "pinia";
import { ref } from "vue";

import {
  login,
  register,
  getCurrentUser,
} from "../services/authService";

export const useAuthStore = defineStore(
  "auth",
  () => {

    const user = ref<any>(null);

    const token = ref(
      localStorage.getItem("token")
    );

    const loading = ref(false);

    const registerUser = async (
      userData: any
    ) => {

      loading.value = true;

      try {

        const data =
          await register(
            userData
          );

        token.value =
          data.token;

        user.value =
          data.user;

        localStorage.setItem(
          "token",
          data.token
        );

      } finally {

        loading.value = false;

      }

    };

    const loginUser = async (
      credentials: any
    ) => {

      loading.value = true;

      try {

        const data =
          await login(
            credentials
          );

        token.value =
          data.token;

        user.value =
          data.user;

        localStorage.setItem(
          "token",
          data.token
        );

      } finally {

        loading.value = false;

      }

    };

    const fetchCurrentUser =
      async () => {

      try {

        const currentUser =
          await getCurrentUser();

        user.value =
          currentUser;

      } catch (error) {

        console.error(error);

        logout();

      }

    };

    const logout = () => {

      token.value = null;

      user.value = null;

      localStorage.removeItem(
        "token"
      );

    };

    return {
      user,
      token,
      loading,
      registerUser,
      loginUser,
      fetchCurrentUser,
      logout,
    };

});