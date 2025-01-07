"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FitnessPlanData } from "../../interfaces/common";
import apiClient from "../../utils/apiClient";
import { TextReveal } from "../common/TextReveal";
import { TrainingProgress } from "./TrainingProgress";

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

  return (
    <header className="flex justify-between text-white py-2 px-4 rounded-lg shadow-lg">
      <div className="flex items-center ml-2 text-3xl font-bold text-black-light">
        <TextReveal text={motivationalMessage} />
      </div>
      <div className="flex justify-start">
        <TrainingProgress
          intensityType="Low Intensity"
          needed={planData.lowIntensityNeeded}
          completed={planData.lowIntensityCompleted}
          pending={planData.lowIntensityPending}
          priority="Low"
        />
        <TrainingProgress
          intensityType="Medium Intensity"
          needed={planData.mediumIntensityNeeded}
          completed={planData.mediumIntensityCompleted}
          pending={planData.mediumIntensityPending}
          priority="Moderate"
        />
        <TrainingProgress
          intensityType="High Intensity"
          needed={planData.highIntensityNeeded}
          completed={planData.highIntensityCompleted}
          pending={planData.highIntensityPending}
          priority="High"
        />
      </div>
    </header>
  );
};

export default FitnessPlanHeader;
