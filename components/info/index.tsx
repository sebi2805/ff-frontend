import React from "react";

const Info: React.FC = () => {
  return (
    <div className="w-full flex justify-center">
      <div className="min-h-screen w-fit bg-white my-2 rounded-md text-black-dark px-8 py-10 flex flex-col items-center">
        <h1 className="text-3xl font-semibold mb-6">Weekly Fitness Plans</h1>
        <div className="space-y-6 text-black-dark max-w-xl">
          <div>
            <h2 className="text-xl font-bold mb-1">
              Plan &quot;Fundament&quot; (Beginner Level):
            </h2>
            <p className="mb-2">
              2 low-activity training sessions per week. Ideal for those
              starting out and wanting a fitness foundation.
            </p>
            <p className="text-green-300">
              <strong>Reward:</strong> A protein bar or shake of your choice.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">
              Plan &quot;Evolution&quot; (Intermediate Level):
            </h2>
            <p className="mb-2">
              2 low-activity + 2 moderate-activity training sessions per week.
              Perfect for a smooth transition to higher fitness levels.
            </p>
            <p className="text-green-300">
              <strong>Reward:</strong> One free sauna session.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">
              Plan &quot;Performance&quot; (Advanced Level):
            </h2>
            <p className="mb-2">
              2 high-activity + 2 moderate-activity training sessions per week.
              Suited for those aiming for enhanced performance.
            </p>
            <p className="text-green-300">
              <strong>Reward:</strong> One free training session.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-1">
              Plan &quot;Elite&quot; (Expert Level):
            </h2>
            <p className="mb-2">
              Combines low, moderate, and high-activity workouts (2 each) per
              week. Perfect for top athletes seeking maximum achievement.
            </p>
            <p className="text-green-300">
              <strong>Reward:</strong> 15% discount on your next subscription.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-4 text-center max-w-xl">
          <h3 className="text-lg font-semibold mb-2 text-red-500">
            Important Information
          </h3>
          <p className="text-black-dark mb-4">
            Rewards are granted at the end of each month upon completing your
            plan. Fitness plans can only be changed every 2 months, so choose
            carefully!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
