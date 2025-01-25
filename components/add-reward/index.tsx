"use client";
import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import Button from "../common/Button";
import apiClient from "../../utils/apiClient";

interface SelectOptions {
  label: string;
  value: string;
}

interface AddRewardDto {
  NormalUserId: string;
  GymId: string;
  Name: string;
}

const AddRewardPage: React.FC = () => {
  const [users, setUsers] = useState<SelectOptions[]>([]);
  const [gyms, setGyms] = useState<SelectOptions[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedGym, setSelectedGym] = useState<string>("");
  const [rewardName, setRewardName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, gymRes] = await Promise.all([
          apiClient.get<SelectOptions[]>("api/Users/get-user-options"),
          apiClient.get<SelectOptions[]>("api/Users/get-gym-options"),
        ]);

        setUsers(userRes.data);
        setGyms(gymRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch user/gym options");
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!selectedUser) newErrors.push("Please select a user.");
    if (!selectedGym) newErrors.push("Please select a gym.");
    if (!rewardName.trim()) newErrors.push("Reward name cannot be empty.");

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors([]);
    setIsLoading(true);

    const payload: AddRewardDto = {
      NormalUserId: selectedUser,
      GymId: selectedGym,
      Name: rewardName,
    };

    try {
      const response = await apiClient.post("api/Rewards/add", payload);
      if (response.status === 200) {
        toast.success("Reward created successfully!");
        setSelectedUser("");
        setSelectedGym("");
        setRewardName("");
      } else {
        toast.error("Error creating reward");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error creating reward");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Add a new Reward</h1>

      {errors.length > 0 && (
        <div className="bg-red-500 text-white p-2 mb-4">
          <ul>
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div>
          <label className="block mb-1 text-black-dark">Select User</label>
          <select
            className="w-full border p-2 rounded text-black-dark"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- select user --</option>
            {users.map((u) => (
              <option key={u.value} value={u.value}>
                {u.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black-dark">Select Gym</label>
          <select
            className="w-full border p-2 rounded text-black-dark"
            value={selectedGym}
            onChange={(e) => setSelectedGym(e.target.value)}
          >
            <option value="">-- select gym --</option>
            {gyms.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 text-black-dark">Reward Name</label>
          <input
            placeholder="Enter reward name"
            type="text"
            className="w-full border p-2 rounded text-black-dark"
            value={rewardName}
            onChange={(e) => setRewardName(e.target.value)}
          />
        </div>

        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-green-200 text-white py-2 px-4 rounded hover:bg-green-150"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddRewardPage;
