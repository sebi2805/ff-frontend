import { PriorityIcon } from "../common/PriorityIcon";

interface TrainingProgressProps {
  intensityType: string;
  needed: number;
  completed: number;
  pending: number;
  priority: string;
}

export const TrainingProgress: React.FC<TrainingProgressProps> = ({
  intensityType,
  needed,
  completed,
  pending,
  priority,
}) => {
  if (needed <= 0) return null;

  const isComplete = needed === completed;

  return (
    <div
      className={`flex flex-col items-center mr-2 justify-center w-fit bg-white p-2 border rounded-md mb-1 text-xs ${
        isComplete ? "border-green-500" : "border-red-500"
      }`}
    >
      <div className="flex items-center">
        <PriorityIcon priority={priority} size="24" />

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
