import React, { Fragment, useState, FormEvent } from "react";
import { Dialog, Transition } from "@headlessui/react";
import CreatableSelect from "react-select/creatable";
import { AddClassDto } from "../../interfaces/class";

interface EventModalProps {
  isOpen: boolean;
  trainers: string[];
  onClose: () => void;
  onAddEvent: (classDto: AddClassDto) => void;
  defaultDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  trainers,
  onClose,
  onAddEvent,
  defaultDate,
}) => {
  interface FormValues {
    trainerName: string;
    interval: string;
    startDate: string;
    endDate: string;
  }

  // Default values for the form
  const defaultStart = defaultDate.toISOString().substring(0, 16);
  const defaultEnd = new Date(defaultDate.getTime() + 60 * 60 * 1000)
    .toISOString()
    .substring(0, 16);

  const [formValues, setFormValues] = useState<FormValues>({
    trainerName: "",
    interval: "0",
    startDate: defaultStart,
    endDate: defaultEnd,
  });

  const trainerOptions = trainers.map((trainer) => ({
    label: trainer,
    value: trainer,
  }));

  const handleTrainerChange = (selectedOption: any) => {
    setFormValues((prev) => ({
      ...prev,
      trainerName: selectedOption?.value || "",
    }));
  };

  const handleChange =
    (field: keyof FormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const classDto: AddClassDto = {
      trainerName: formValues.trainerName,
      interval: Number(formValues.interval),
      startDate: new Date(formValues.startDate).toISOString(),
      endDate: new Date(formValues.endDate).toISOString(),
    };

    onAddEvent(classDto);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={onClose}
        aria-modal="true"
        role="dialog"
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
                Add New Class
              </Dialog.Title>
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Trainer Select */}
                <div>
                  <label className="block text-sm font-medium text-black-text">
                    Trainer Name
                  </label>
                  <CreatableSelect
                    isClearable
                    options={trainerOptions}
                    onChange={handleTrainerChange}
                    className="mt-1"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        backgroundColor: "#2a2a2a", // Matches `bg-black-lighter`
                        color: "#e5e5e5", // Matches `text-black-text`
                        borderColor: state.isFocused ? "#a872ff" : "#4b5563", // Purple for focus, gray for default
                        boxShadow: state.isFocused
                          ? "0 0 0 1px #a872ff"
                          : undefined,
                        "&:hover": {
                          borderColor: "#a872ff", // Purple hover
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#1a1a1a", // Matches darker black
                        color: "#e5e5e5", // Matches text color
                      }),
                      singleValue: (base) => ({
                        ...base,
                        color: "#e5e5e5", // Matches text-black-text
                      }),
                      input: (base) => ({
                        ...base,
                        color: "#e5e5e5", // Matches text-black-text
                      }),
                      placeholder: (base) => ({
                        ...base,
                        color: "#888888", // Matches muted text
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused
                          ? "#a872ff"
                          : "#1a1a1a", // Purple for focus, darker black for default
                        color: "#e5e5e5", // Matches text color
                        "&:active": {
                          backgroundColor: "#a872ff", // Purple on active
                        },
                      }),
                    }}
                  />
                </div>

                {/* Interval */}
                <div>
                  <label className="block text-sm font-medium text-black-text">
                    Interval (days)
                  </label>
                  <input
                    type="number"
                    className="mt-1 pl-4 block w-full border-gray-300 rounded-md bg-black-lighter text-black-text focus:outline-none focus:ring-purple-400 focus:border-purple-400 focus:ring-2"
                    value={formValues.interval}
                    onChange={handleChange("interval")}
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-black-text">
                    Start Date
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 pl-4 block w-full border-gray-300 rounded-md bg-black-lighter text-black-text focus:outline-none focus:ring-purple-400 focus:border-purple-400 focus:ring-2"
                    value={formValues.startDate}
                    onChange={handleChange("startDate")}
                    required
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-black-text">
                    End Date
                  </label>
                  <input
                    type="datetime-local"
                    className="mt-1 pl-4 block w-full border-gray-300 rounded-md bg-black-lighter text-black-text focus:outline-none focus:ring-purple-400 focus:border-purple-400 focus:ring-2"
                    value={formValues.endDate}
                    onChange={handleChange("endDate")}
                    required
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <button
                    type="button"
                    className="bg-black-lighter hover:bg-black-dark text-black-text font-bold py-2 px-4 rounded"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-purple-400 hover:bg-purple-200 text-black-text font-bold py-2 px-4 rounded"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventModal;
