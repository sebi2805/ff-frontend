import { Dialog, Transition } from "@headlessui/react";
import React, { FormEvent, Fragment, useMemo, useState } from "react";
import CreatableSelect from "react-select/creatable";
import { AddClassDto, ClassFormValues } from "../../interfaces/class";
import Button from "../common/Button";

interface EventModalProps {
  isOpen: boolean;
  trainers: string[];
  isLoading: boolean;
  onClose: () => void;
  onAddEvent: (classDto: AddClassDto) => void;
  defaultStartDate: Date;
  defaultEndDate: Date;
}

const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  trainers,
  isLoading,
  onClose,
  onAddEvent,
  defaultStartDate,
  defaultEndDate,
}) => {
  // Default values for the form
  const defaultStart = useMemo(() => {
    return defaultStartDate
      .toLocaleString("sv-SE")
      .replace(" ", "T")
      .substring(0, 16);
  }, [defaultStartDate]);

  const defaultEnd = useMemo(() => {
    return defaultEndDate
      .toLocaleString("sv-SE")
      .replace(" ", "T")
      .substring(0, 16);
  }, [defaultEndDate]);

  const [formValues, setFormValues] = useState<ClassFormValues>({
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
    (field: keyof ClassFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const newErrors: string[] = [];
    const startDate = new Date(formValues.startDate);
    const endDate = new Date(formValues.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Comparăm doar datele, nu orele

    if (!formValues.trainerName) {
      newErrors.push("Trainer name cannot be empty.");
    }

    if (startDate.getTime() < today.getTime()) {
      newErrors.push("Start date cannot be in the past.");
    }

    if (startDate.getTime() >= endDate.getTime()) {
      newErrors.push("Start date must be before the end date.");
    }

    if (Number(formValues.interval) < 0) {
      newErrors.push("Interval cannot be negative.");
    }

    if (newErrors.length > 0) {
      setErrors(newErrors); // Stocăm erorile pentru afișare
      return;
    }

    setErrors([]); // Resetăm erorile dacă totul este valid

    const classDto: AddClassDto = {
      trainerName: formValues.trainerName,
      interval: Number(formValues.interval),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
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

              {/* Afișare Erori */}
              {errors.length > 0 && (
                <div className="bg-red-500 text-white text-sm p-3 rounded-md">
                  <ul>
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                {/* Restul codului pentru formular */}
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
                        backgroundColor: state.isFocused
                          ? "#a872ff"
                          : "#1a1a1a",
                        color: "#e5e5e5",
                        "&:active": {
                          backgroundColor: "#a872ff",
                        },
                      }),
                    }}
                  />
                </div>

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
                  <Button
                    isLoading={isLoading}
                    type="submit"
                    className="bg-purple-400 hover:bg-purple-200 text-black-text font-bold py-2 px-4 rounded"
                  >
                    Save
                  </Button>
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
