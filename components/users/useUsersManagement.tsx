import { useState } from "react";
import { GetUserAdminDto } from "../../interfaces/user";
import apiClient from "../../utils/apiClient";
import { toast } from "react-toastify";
import { decodeErrorMessage } from "../../utils/errorMessages";

interface UsersManagement {
  users: GetUserAdminDto[];
  onDelete: (id: string) => void;
  onToggle: (id: string) => void;
  fetchUsers: () => void;
}

// I didnt implement it as a context because it's only used in one component
export const useUsersManagement = () => {
  const [users, setUsers] = useState<GetUserAdminDto[]>([]);

  // TODO implement loading state
  // const [isLoadingTable, setIsLoadingTable] = useState(false);

  const fetchUsers = async () => {
    await apiClient
      .get<GetUserAdminDto[]>("/api/Users/get-all")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        const errorMessage = decodeErrorMessage(error?.response?.data[0]);
        toast.error(errorMessage);
      });
  };

  const onDelete = async (id: string) => {
    await apiClient
      .delete(`/api/Users/delete/${id}`)
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
        toast.success("The user has been deleted.");
      })
      .catch((error) => {
        const errorMessage = decodeErrorMessage(error?.response?.data[0]);
        toast.error(errorMessage);
      });
  };

  const onToggle = async (id: string) => {
    await apiClient
      .get(`/api/Users/toggle-activate/${id}`)
      .then(() => {
        setUsers(
          users.map((user) => {
            if (user.id === id) {
              return { ...user, isVerified: true };
            }
            return user;
          })
        );
        if (users.find((user) => user.id === id)?.isVerified) {
          toast.success("The user has been activated.");
        } else {
          toast.success("The user has been deactivated.");
        }
      })
      .catch((error) => {
        const errorMessage = decodeErrorMessage(error?.response?.data[0]);
        toast.error(errorMessage);
      });
  };

  return { users, fetchUsers, onDelete, onToggle } as UsersManagement;
};
