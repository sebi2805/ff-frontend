import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Select from "react-select";

interface PlanSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: string | null) => void;
}

const planOptions = [
  { value: "Beginner", label: "Fundament (Beginner)" },
  { value: "Intermediate", label: "Evolution (Intermediate)" },
  { value: "Advanced", label: "Performance (Advanced)" },
  { value: "Expert", label: "Elite (Expert)" },
];

const PlanSelectModal: React.FC<PlanSelectModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleSubmit = () => {
    onSubmit(selectedPlan);
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
            <div
              className="inline-block align-bottom bg-black-light rounded-lg px-6 pt-5 pb-4 text-left
            overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-md sm:w-full
            "
            >
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-white mb-4"
              >
                Choose Your Plan
              </Dialog.Title>

              {/* Plan descriptions */}
              <div className="text-sm text-gray-200 space-y-2 mb-4">
                <p>
                  <strong>Plan &quot;Fundament&quot; (Beginner Level):</strong>
                  <br />
                  2 low-activity training sessions.
                  <br />
                  Ideal for those starting out and wanting a fitness foundation.
                </p>
                <p>
                  <strong>
                    Plan &quot;Evolution&quot; (Intermediate Level):
                  </strong>
                  <br />
                  2 low-activity trainings, 2 moderate-activity trainings.
                  <br />A gentle transition to a higher fitness level.
                </p>
                <p>
                  <strong>
                    Plan &quot;Performance&quot; (Advanced Level):
                  </strong>
                  <br />
                  2 high-activity trainings, 2 moderate-activity trainings.
                  <br />
                  Great for those aiming for elevated performance.
                </p>
                <p>
                  <strong>Plan &quot;Elite&quot; (Expert Level):</strong>
                  <br />
                  Combines low, moderate, and high-activity workouts:
                  <br />
                  2 low-level, 2 moderate-level, and 2 high-level sessions.
                  <br />
                  Ideal for top athletes seeking maximum performance.
                </p>
              </div>

              {/* React Select */}
              <Select
                options={planOptions}
                onChange={(option) => setSelectedPlan(option?.value || null)}
                className="mb-4 text-black"
                menuPortalTarget={document.body} // Plasează dropdown-ul în body
                styles={{
                  control: (base, state) => ({
                    ...base,
                    backgroundColor: "#2a2a2a",
                    color: "#e5e5e5",
                    borderColor: state.isFocused ? "#a872ff" : "#4b5563",
                    boxShadow: state.isFocused
                      ? "0 0 0 1px #a872ff"
                      : undefined,
                    "&:hover": {
                      borderColor: "#a872ff",
                    },
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "#1a1a1a",
                    color: "#e5e5e5",
                    zIndex: 1050, // Asigură că dropdown-ul este deasupra altor elemente din modal
                  }),
                  menuPortal: (base) => ({
                    ...base,
                    zIndex: 1060, // Z-index mai mare decât modalul
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: "#e5e5e5",
                  }),
                  input: (base) => ({
                    ...base,
                    color: "#e5e5e5",
                  }),
                  placeholder: (base) => ({
                    ...base,
                    color: "#888888",
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isFocused ? "#a872ff" : "#1a1a1a",
                    color: "#e5e5e5",
                    "&:active": {
                      backgroundColor: "#a872ff",
                    },
                  }),
                }}
              />

              {/* Buttons */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="bg-green-300 hover:bg-green-100 text-white font-bold py-2 px-4 rounded"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PlanSelectModal;
