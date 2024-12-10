"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "../../utils/apiClient";

export interface GetClassDto {
  id: string;
  trainerName: string;
  gymName: string;
  color: string;
  startDate: string;
  endDate: string;
}

const ClassDetailsPage = () => {
  const params = useParams();
  const { classId } = params;

  const [classData, setClassData] = useState<GetClassDto | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoined, setIsJoined] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

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
    setIsToggling(true);
    try {
      await apiClient.post(`/api/Classes/toggle-join/${classId}`);
      await checkUserJoined();
      await fetchParticipants(); // Refresh the participants list
    } catch (error) {
      console.error("Error toggling join status:", error);
    }
    setIsToggling(false);
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchClass();
      await fetchParticipants();
      await checkUserJoined();
      setIsLoading(false);
    };
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
        <div className="flex-col">
          <h1 className="text-4xl font-bold" style={{ color: color }}>
            {trainerName} @ {gymName}
          </h1>
          <p className="text-sm text-black-dark">Start: {formattedStart}</p>
          <p className="text-sm text-black-dark">End: {formattedEnd}</p>
        </div>

        <button
          onClick={toggleJoin}
          disabled={isToggling}
          className={`mt-4 px-4 py-2 font-bold rounded ${
            isJoined
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          } transition-colors`}
        >
          {isToggling ? "Processing..." : isJoined ? "Leave" : "Join"}
        </button>
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
    </div>
  );
};

export default ClassDetailsPage;
