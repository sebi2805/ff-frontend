"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../utils/apiClient";
import { getRole } from "../../utils/common";
import { decodeErrorMessage } from "../../utils/errorMessages";
import Button from "../common/Button";
import ConfirmationModal from "../common/ConfirmationModal";
import { GetClassDto } from "../../interfaces/class";

const getPriorityIcon = (priority: string) => {
  console.log(priority);
  switch (priority) {
    case "High":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="64"
          height="64"
          className="bg-white rounded-md"
        >
          <path
            d="M3.5 9.9c-.5.3-1.1.1-1.4-.3s-.1-1.1.4-1.4l5-3c.3-.2.7-.2 1 0l5 3c.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3L8 7.2 3.5 9.9z"
            fill="#ff5630"
          />
        </svg>
      );
    case "Moderate":
      return (
        <svg
          version="1.1"
          id="Warstwa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          className="bg-white rounded-md"
          height="64"
          viewBox="0 0 16 16"
          x="0px"
          y="0px"
        >
          <g id="icon_x2F_16px_x2F_medium-priority-">
            <g>
              <path
                className="fill-[#FFAB00]"
                d="M3,4h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3C2.4,6,2,5.6,2,5S2.4,4,3,4z M3,10h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3
            c-0.6,0-1-0.4-1-1S2.4,10,3,10z"
              />
            </g>
          </g>
        </svg>
      );

    case "Low":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="bg-white rounded-md"
          width="64"
          height="64"
        >
          <path
            d="M12.5 6.1c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.3 1.3l-5 3c-.3.2-.7.2-1 0l-5-3c-.6-.2-.7-.9-.4-1.3.2-.5.9-.7 1.3-.4L8 8.8l4.5-2.7z"
            fill="#0065ff"
          />
        </svg>
      );
    default:
      return null;
  }
};
const ClassDetailsPage = () => {
  const params = useParams();
  const { classId } = params;
  const router = useRouter();

  const [classData, setClassData] = useState<GetClassDto | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isLoadingButton, setIsLoadingButton] = useState(false);
  const [role, setRole] = useState<string | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const fetchClass = async () => {
    try {
      const response = await apiClient.get<GetClassDto>(
        `/api/Classes/get/${classId}`
      );
      setClassData(response.data);
    } catch (error) {
      console.error("Error fetching class:", error);
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await apiClient.get<string[]>(
        `/api/Classes/get-participants/${classId}`
      );
      setParticipants(response.data);
    } catch (error) {
      console.error("Error fetching participants:", error);
    }
  };

  const fetchRole = async () => {
    const userRole = await getRole();
    setRole(userRole);
  };

  const checkUserJoined = async () => {
    try {
      const response = await apiClient.get<boolean>(
        `/api/Classes/check-user/${classId}`
      );
      setIsJoined(response.data);
    } catch (error) {
      console.error("Error checking user status:", error);
    }
  };

  const toggleJoin = async () => {
    setIsLoadingButton(true);
    await apiClient
      .post(`/api/Classes/toggle-join/${classId}`)
      .then(async () => {
        toast.success(
          isJoined
            ? "Successfully left the class."
            : "Successfully joined the class."
        );
        await checkUserJoined();
        await fetchParticipants();
        setIsLoadingButton(false);
      })
      .catch((error) => {
        const errorMessage = error.response?.data[0] || "Joining failed.";
        toast.error(decodeErrorMessage(errorMessage));
        setIsLoadingButton(false);
      });
  };

  const handleDelete = () => {
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await apiClient.delete(`/api/Classes/delete/${classId}`);
      toast.success("Class deleted successfully.");
      setDeleteModalOpen(false);
      router.push("/home");
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error("Failed to delete class.");
    }
  };

  const loadData = async () => {
    await fetchClass();
    await fetchParticipants();
    await checkUserJoined();
    await fetchRole();
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [classId]);

  if (isLoading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  if (!classData) {
    return <div className="text-white text-center mt-8">Class not found</div>;
  }

  const { trainerName, gymName, startDate, endDate, color } = classData;
  const formattedStart = new Date(startDate).toLocaleString();
  const formattedEnd = new Date(endDate).toLocaleString();

  return (
    <div className="p-6 min-h-screen">
      {/* Class Header */}
      <div className="text-3xl font-bebas px-4 mb-6 text-black-dark bg-purple-200 p-4 rounded-md flex justify-between items-start">
        <div className="flex items-center">
          {getPriorityIcon(classData.priority)}
          <div className="flex-col ml-4">
            <h1 className="text-4xl font-bold" style={{ color: color }}>
              {trainerName} @ {gymName}
            </h1>
            <p className="text-sm text-black-dark">Start: {formattedStart}</p>
            <p className="text-sm text-black-dark">End: {formattedEnd}</p>
          </div>
        </div>
        {role === "GymOwner" ? (
          <Button
            isLoading={isLoadingButton}
            onClick={handleDelete}
            className="mt-4 px-4 py-2 font-bold rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            Delete Class
          </Button>
        ) : role === "NormalUser" ? (
          <Button
            isLoading={isLoadingButton}
            onClick={toggleJoin}
            className={`mt-4 px-4 py-2 font-bold rounded ${
              isJoined
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            } transition-colors`}
          >
            {isJoined ? "Leave" : "Join"}
          </Button>
        ) : null}
      </div>

      {/* Participants Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-black-light text-white">
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Participant Name</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((participant, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={index}
                  className={`border-b border-purple-700 ${
                    isEven ? "bg-purple-200" : "bg-pink-200"
                  } hover:bg-purple-400 transition-colors`}
                >
                  <td className="px-6 py-3 text-gray-800">{index + 1}</td>
                  <td className="px-6 py-3 text-gray-800">{participant}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal for Deletion */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this class? This action cannot be undone."
        confirmText="Delete"
        confirmButtonColor="bg-red-600"
      />
    </div>
  );
};

export default ClassDetailsPage;
