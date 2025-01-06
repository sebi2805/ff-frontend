"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import apiClient from "../../utils/apiClient";
import { FitnessPlanData } from "../../interfaces/common";
import { TextReveal } from "../common/TextReveal";

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "High":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
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
          width="24"
          className="bg-white rounded-md"
          height="24"
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
          width="24"
          height="24"
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

const FitnessPlanHeader: React.FC = () => {
  const [planData, setPlanData] = useState<FitnessPlanData | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");
  const messages = [
    "Push harder than yesterday if you want a different tomorrow.",
    "Sweat is just fat crying!",
    "Your only limit is you.",
    "Believe in yourself and all that you are.",
    "Fitness is not a destination, it’s a way of life.",
    "Every workout counts!",
    "You are stronger than you think.",
    "Consistency is key to progress.",
    "Small progress is still progress.",
    "Dream big. Work hard. Stay focused.",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get("/api/Users/get-weekly-progress");
        setPlanData(response.data);
      } catch (error) {
        console.error("Error fetching fitness plan data:", error);
        toast.error(
          "Failed to load fitness plan data. Please try again later."
        );
      }
    };

    fetchData();

    // Select a random motivational message
    const randomIndex = Math.floor(Math.random() * messages.length);
    setMotivationalMessage(messages[randomIndex]);
  }, []);

  if (!planData) {
    return (
      <div className="text-white text-center py-4">
        <p>Loading your fitness plan...</p>
      </div>
    );
  }

  const renderTraining = (
    intensityType: string,
    needed: number,
    completed: number,
    pending: number,
    priority: string
  ) => {
    if (needed <= 0) return null;

    const isComplete = needed === completed;

    return (
      <div
        className={`flex flex-col items-center mr-2 justify-center w-fit bg-white p-2 border rounded-md mb-1 text-xs ${
          isComplete ? "border-green-500" : "border-red-500"
        }`}
      >
        <div className="flex items-center">
          {getPriorityIcon(priority)}
          <p className="font-semibold text-black-light pl-2">{intensityType}</p>
        </div>
        <p
          className={`font-bold ${
            isComplete ? "text-green-500" : "text-red-500"
          }`}
        >
          {completed} / {needed}
        </p>
        <p className="text-yellow-700">Pending: {pending}</p>
      </div>
    );
  };

  return (
    <header className="flex justify-between text-white py-2 px-4 rounded-lg shadow-lg">
      <div className="flex items-center ml-2 text-3xl font-bold text-black-light">
        <TextReveal text={motivationalMessage} />
      </div>
      <div className="flex justify-start">
        {renderTraining(
          "Low Intensity",
          planData.lowIntensityNeeded,
          planData.lowIntensityCompleted,
          planData.lowIntensityPending,
          "Low"
        )}
        {renderTraining(
          "Medium Intensity",
          planData.mediumIntensityNeeded,
          planData.mediumIntensityCompleted,
          planData.mediumIntensityPending,
          "Moderate"
        )}
        {renderTraining(
          "High Intensity",
          planData.highIntensityNeeded,
          planData.highIntensityCompleted,
          planData.highIntensityPending,
          "High"
        )}
      </div>
    </header>
  );
};

export default FitnessPlanHeader;
