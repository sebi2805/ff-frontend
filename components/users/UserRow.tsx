import React from "react";
import { GetUserAdminDto } from "../../interfaces/user";

interface UserRowProps {
  user: GetUserAdminDto;
  index: number;
  onOpenDeleteModal: (userId: string, name: string) => void;
  onOpenToggleModal: (userId: string, name: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({
  user,
  index,
  onOpenDeleteModal,
  onOpenToggleModal,
}) => {
  const formattedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <tr
      key={user.id}
      className={`border-b border-black-lighter ${
        index % 2 ? "bg-purple-200" : "bg-pink-200"
      } hover:bg-purple-400`}
    >
      <td className="px-4 py-2 text-text text-black-lighter">
        {formattedDate}
      </td>
      <td className="px-4 py-2 text-text text-black-lighter">{user.name}</td>
      <td className="px-4 py-2 text-text text-black-lighter">{user.email}</td>
      <td className="px-4 py-2 text-text text-black-lighter">
        {user.location || "N/A"}
      </td>
      <td className="px-4 py-2 text-text text-black-lighter">{user.role}</td>
      <td className="px-4 py-2 text-text text-black-lighter">
        {user.isVerified ? "Yes" : "No"}
      </td>
      <td className="px-4 py-2 text-text flex space-x-2">
        <button
          onClick={() => onOpenToggleModal(user.id, user.name)}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-2 rounded"
        >
          Toggle
        </button>
        <button
          onClick={() => onOpenDeleteModal(user.id, user.name)}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
