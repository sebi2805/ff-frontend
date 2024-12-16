"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetRewardDto } from "../../interfaces/reward";
import apiClient from "../../utils/apiClient";
import Button from "../common/Button";

const RewardsTable = () => {
  const [rewards, setRewards] = useState<GetRewardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRewards = async () => {
    try {
      const response = await apiClient.get<GetRewardDto[]>(
        "/api/Rewards/get-all"
      );
      setRewards(response.data);
    } catch (error) {
      console.error("Error fetching rewards:", error);
      toast.error("Failed to fetch rewards.");
    } finally {
      setIsLoading(false);
    }
  };

  const redeemReward = async (id: string) => {
    try {
      console.log(`Redeeming reward with id: ${id}`);
      toast.success("Reward redeemed successfully.");
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("Failed to redeem reward.");
    }
  };

  useEffect(() => {
    fetchRewards();
  }, []);

  if (isLoading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  //TODO
  return (
    <div className="container mx-auto p-4 mt-3 flex-col justify-center items-start">
      <h1 className="text-3xl font-bebas mb-6 text-black-dark bg-purple-200 p-4 rounded-md">
        Rewards List
      </h1>
      <div className="w-full overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full border-collapse rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-black-light text-white rounded-lg">
              <th className="px-6 py-3 text-left">#</th>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Normal User</th>
              <th className="px-6 py-3 text-left">Gym Name</th>
              <th className="px-6 py-3 text-left">Redeem Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward, index) => {
              const isEven = index % 2 === 0;
              return (
                <tr
                  key={reward.id}
                  className={`border-b border-purple-700 ${
                    isEven ? "bg-purple-200" : "bg-pink-200"
                  } hover:bg-purple-400 transition-colors`}
                >
                  <td className="px-6 py-3 text-gray-800">{index + 1}</td>
                  <td className="px-6 py-3 text-gray-800">{reward.name}</td>
                  <td className="px-6 py-3 text-gray-800">
                    {reward.normalname}
                  </td>
                  <td className="px-6 py-3 text-gray-800">{reward.gymName}</td>
                  <td className="px-6 py-3 text-gray-800">
                    {new Date(reward.redeemDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {reward.redeemDate === null ? (
                      <Button
                        isLoading={isLoading}
                        type="button"
                        onClick={() => redeemReward(reward.id)}
                        className="bg-purple-800 hover:bg-purple-200 text-black-text hover:text-black-dark font-bold py-2 px-4 rounded"
                      >
                        Redeem
                      </Button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RewardsTable;
