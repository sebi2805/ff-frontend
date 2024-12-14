import { toast } from "react-toastify";
import apiClient from "./apiClient";

// if somebody ever comes across this approach
// please I want to let you know that I didn't want to do a context for a string
export const getRole = async (): Promise<string | null> => {
  return apiClient
    .get<string>("api/Users/get-role")
    .then((response) => response.data)
    .catch((error) => {
      const errorMessage = error.response?.data?.[0] || "Joining failed.";
      toast.error(errorMessage);
      return null;
    });
};
