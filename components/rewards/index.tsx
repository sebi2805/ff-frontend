"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { GetRewardDto } from "../../interfaces/reward";
import apiClient from "../../utils/apiClient";
import Button from "../common/Button";
import { getRole } from "../../utils/common";
import RewardsModal from "./RewardsModal";

const RewardsTable = () => {
  const [rewards, setRewards] = useState<GetRewardDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

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

  const fetchRole = async () => {
    const userRole = await getRole();
    setRole(userRole);
  };

  const redeemReward = async (id: string) => {
    try {
      await apiClient.post(`/api/Rewards/claim/${id}`).then(() => {
        toast.success("Reward redeemed successfully.");
        fetchRewards();
      });
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast.error("Failed to redeem reward.");
    }
  };

  useEffect(() => {
    fetchRewards();
    fetchRole();
  }, []);

  if (isLoading) {
    return <div className="text-white text-center mt-8">Loading...</div>;
  }

  const onClose = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  //TODO
  return (
    <>
      <RewardsModal isOpen={isOpen} onClose={onClose} />
      <div className="container mx-auto p-4 mt-3 flex-col justify-center items-start">
        <div className=" bg-purple-200 p-4 rounded-md flex justify-between items-center">
          <h1 className="text-3xl font-bebas text-black-dark text-center">
            Rewards List
          </h1>
          <Button
            onClick={openModal}
            className="bg-purple-500 text-white py-2 px-2 rounded hover:bg-purple-400 font-bold"
          >
            Modify Rewards
          </Button>
        </div>
        <div className="w-full overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-black-light text-white rounded-lg">
                <th className="px-6 py-3 text-left">#</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Normal User</th>
                <th className="px-6 py-3 text-left">Gym Name</th>
                <th className="px-6 py-3 text-left">Received Date</th>
                <th className="px-6 py-3 text-left">Redeem Date</th>
                {role === "NormalUser" && (
                  <th className="px-6 py-3 text-center">Action</th>
                )}
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
                      {reward.normalUserName}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                      {reward.gymName}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                      {new Date(reward.receivedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-3 text-gray-800">
                      {reward.redeemDate &&
                        new Date(reward.redeemDate).toLocaleDateString()}
                    </td>
                    {role === "NormalUser" && (
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
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default RewardsTable;
