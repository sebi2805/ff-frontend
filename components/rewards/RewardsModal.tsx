"use client";
import { Dialog, Transition } from "@headlessui/react";
import React, { ChangeEvent, Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RewardData } from "../../interfaces/reward";
import apiClient from "../../utils/apiClient";
import { fitnessPlanToEnum } from "../../utils/common";
import Button from "../common/Button";

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RewardsModal: React.FC<RewardsModalProps> = ({ isOpen, onClose }) => {
  const [rewards, setRewards] = useState<RewardData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [loadingStates, setLoadingStates] = useState<boolean[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    apiClient
      .get<RewardData[]>("/api/Rewards/get-fitness-plan-rewards")
      .then((res) => {
        setRewards(res.data);
        setLoadingStates(Array(res.data.length).fill(false));
      })
      .catch((err) => {
        setErrors([err?.response?.data ?? "Error fetching rewards."]);
      });
  }, [isOpen]);

  const handleRewardChange =
    (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setRewards((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], rewardName: newValue };
        return copy;
      });
    };

  const handleSaveRow = async (index: number) => {
    const updatedReward = rewards[index];
    const numericPlan = fitnessPlanToEnum(updatedReward.fitnessPlan);
    setErrors([]);
    if (!updatedReward.rewardName?.trim()) {
      setErrors([`Reward name for ${updatedReward.fitnessPlan} is empty.`]);
      return;
    }
    setLoadingStates((prev) =>
      prev.map((state, i) => (i === index ? true : state))
    );
    try {
      await apiClient.post("/api/Rewards/change-fitness-reward", {
        fitnessPlan: numericPlan,
        name: updatedReward.rewardName,
      });
      toast.success(
        `Reward updated successfully for ${updatedReward.fitnessPlan}`
      );
    } catch (err: any) {
      setErrors([err?.response?.data ?? "Error updating reward."]);
    } finally {
      setLoadingStates((prev) =>
        prev.map((state, i) => (i === index ? false : state))
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
      >
        <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black-dark bg-opacity-50" />
          </Transition.Child>
          <span
            className="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-75"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-75"
          >
            <div className="inline-block align-bottom bg-black-light rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full sm:p-6">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-black-text"
              >
                Rewards Settings
              </Dialog.Title>
              {errors.length > 0 && (
                <div className="bg-red-500 text-white text-sm p-3 rounded-md mt-4">
                  <ul>
                    {errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="mt-4 space-y-4">
                {rewards.map((reward, index) => (
                  <div
                    key={reward.fitnessPlan}
                    className="flex flex-col space-y-1 bg-black-lighter p-3 rounded-md"
                  >
                    <span className="text-sm font-medium text-black-text">
                      {reward.fitnessPlan}
                    </span>
                    <input
                      type="text"
                      className="mt-1 block w-full border-gray-300 rounded-md bg-black-dark text-black-text px-2 py-1"
                      value={reward.rewardName}
                      placeholder="Edit reward name..."
                      onChange={handleRewardChange(index)}
                    />
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        className="bg-purple-400 hover:bg-purple-200 text-black-text font-bold py-1 px-3 rounded"
                        onClick={() => handleSaveRow(index)}
                        isLoading={loadingStates[index]}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 pt-4" />
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default RewardsModal;
