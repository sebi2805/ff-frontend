"use client";

import React, { useEffect, useState } from "react";
import UserRow from "./UserRow";
import { useUsersManagement } from "./useUsersManagement";
import ConfirmationModal from "../common/ConfirmationModal";

const UserTable: React.FC = () => {
  const { users, fetchUsers, onDelete, onToggle } = useUsersManagement();

  const [deleteModalState, setDeleteModalState] = useState({
    isOpen: false,
    userId: "",
    name: "",
  });

  const [toggleModalState, setToggleModalState] = useState({
    isOpen: false,
    userId: "",
    name: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const openDeleteModal = (userId: string, name: string) => {
    setDeleteModalState({ isOpen: true, userId, name });
  };

  const closeDeleteModal = () => {
    setDeleteModalState({ isOpen: false, userId: "", name: "" });
  };

  const openToggleModal = (userId: string, name: string) => {
    setToggleModalState({ isOpen: true, userId, name });
  };

  const closeToggleModal = () => {
    setToggleModalState({ isOpen: false, userId: "", name: "" });
  };

  const handleConfirmDelete = () => {
    onDelete(deleteModalState.userId);
    closeDeleteModal();
  };

  const handleConfirmToggle = () => {
    onToggle(toggleModalState.userId);
    closeToggleModal();
  };

  return (
    <div className="container mx-auto p-4 mt-3 flex-col justify-center items-start">
      <h1 className="text-3xl font-bebas mb-6 text-black-dark bg-purple-200 p-4 rounded-md">
        Users Dashboard
      </h1>
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-black-light shadow-md rounded-lg overflow-hidden">
          <thead className="bg-black">
            <tr>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[150px]">
                Created At
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[200px]">
                Name
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[250px]">
                Email
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[200px]">
                Location
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[150px]">
                Role
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[150px]">
                Verified
              </th>
              <th className="px-4 py-2 text-left text-text whitespace-nowrap min-w-[150px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, i) => (
              <UserRow
                key={user.id}
                index={i}
                user={user}
                onOpenDeleteModal={openDeleteModal}
                onOpenToggleModal={openToggleModal}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${deleteModalState.name}? This action cannot be undone.`}
        confirmText="Delete"
        confirmButtonColor="bg-red-600"
      />

      {/* Toggle Confirmation Modal */}
      <ConfirmationModal
        isOpen={toggleModalState.isOpen}
        onClose={closeToggleModal}
        onConfirm={handleConfirmToggle}
        title="Confirm Toggle"
        message={`Are you sure you want to toggle ${toggleModalState.name}'s status?`}
        confirmText="Toggle"
        confirmButtonColor="bg-green-600"
      />
    </div>
  );
};

export default UserTable;
