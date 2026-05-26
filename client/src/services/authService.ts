import api from "./api";

export const register = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data.user;
};