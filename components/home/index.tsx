"use client";
import { CheckIcon } from "@heroicons/react/outline";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer, ToolbarProps } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { toast } from "react-toastify";
import {
  AddClassDto,
  CalendarEvent,
  GetClassDto,
} from "../../interfaces/class";
import apiClient from "../../utils/apiClient";
import { getRole } from "../../utils/common";
import { decodeErrorMessage } from "../../utils/errorMessages";
import EventModal from "./EventModal";
import PlanSelectModal from "./FitnessPlan";
import FitnessPlanHeader from "./FitnessPlanHeader";

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case "High":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="24"
          height="24"
          className="bg-white rounded-md"
        >
          <path
            d="M3.5 9.9c-.5.3-1.1.1-1.4-.3s-.1-1.1.4-1.4l5-3c.3-.2.7-.2 1 0l5 3c.5.3.6.9.3 1.4-.3.5-.9.6-1.4.3L8 7.2 3.5 9.9z"
            fill="#ff5630"
          />
        </svg>
      );
    case "Moderate":
      return (
        <svg
          version="1.1"
          id="Warstwa_1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          className="bg-white rounded-md"
          height="24"
          viewBox="0 0 16 16"
          x="0px"
          y="0px"
        >
          <g id="icon_x2F_16px_x2F_medium-priority-">
            <g>
              <path
                className="fill-[#FFAB00]"
                d="M3,4h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3C2.4,6,2,5.6,2,5S2.4,4,3,4z M3,10h10c0.6,0,1,0.4,1,1s-0.4,1-1,1H3
            c-0.6,0-1-0.4-1-1S2.4,10,3,10z"
              />
            </g>
          </g>
        </svg>
      );

    case "Low":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          className="bg-white rounded-md"
          width="24"
          height="24"
        >
          <path
            d="M12.5 6.1c.5-.3 1.1-.1 1.4.4.3.5.1 1.1-.3 1.3l-5 3c-.3.2-.7.2-1 0l-5-3c-.6-.2-.7-.9-.4-1.3.2-.5.9-.7 1.3-.4L8 8.8l4.5-2.7z"
            fill="#0065ff"
          />
        </svg>
      );
    default:
      return null;
  }
};

interface CustomToolbarProps extends ToolbarProps<CalendarEvent> {
  onToggleFilter: () => void;
  isFilterActive: boolean;
}

const localizer = momentLocalizer(moment);

const EventComponent = ({ event }: { event: CalendarEvent }) => (
  <div className="flex justify-between items-center px-2">
    <div className="flex items-center justify-between">
      {getPriorityIcon(event.resource.priority)}
      {event.hasJoined && (
        <CheckIcon className="inline-block h-6 ml-2 w-6 bg-black-dark rounded-md" />
      )}
    </div>
    {event.title}
  </div>
);
const CustomToolbar: React.FC<CustomToolbarProps> = ({
  label,
  view,
  onNavigate,
  onView,
  onToggleFilter,
  isFilterActive,
}) => {
  return (
    <div className="rbc-toolbar">
      <div className="rbc-btn-group">
        <button type="button" onClick={() => onNavigate("PREV")}>
          Back
        </button>
        <button type="button" onClick={() => onNavigate("TODAY")}>
          Today
        </button>
        <button type="button" onClick={() => onNavigate("NEXT")}>
          Next
        </button>
      </div>

      <span className="rbc-toolbar-label">{label}</span>

      <div className="rbc-btn-group">
        <button
          type="button"
          onClick={() => onView("month")}
          className={view === "month" ? "rbc-active" : ""}
        >
          Month
        </button>
        <button
          type="button"
          onClick={() => onView("week")}
          className={view === "week" ? "rbc-active" : ""}
        >
          Week
        </button>
        <button
          type="button"
          onClick={() => onView("day")}
          className={view === "day" ? "rbc-active" : ""}
        >
          Day
        </button>
        <button
          type="button"
          onClick={() => onView("agenda")}
          className={view === "agenda" ? "rbc-active" : ""}
        >
          Agenda
        </button>
      </div>
      <button
        type="button"
        onClick={onToggleFilter}
        className={`rbc-btn ${isFilterActive ? "rbc-active" : ""}`}
      >
        {isFilterActive ? "Show all classes" : "Show only joined classes"}
      </button>
    </div>
  );
};

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState<Date | null>(null);
  const [selectedEndDate, setSelectedEndDate] = useState<Date | null>(null);
  const [trainers, setTrainers] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFitnessPlanModalOpen, setIsFitnessPlanModalOpen] = useState(false);

  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>(events);
  const [isFilterActive, setIsFilterActive] = useState(false);

  const router = useRouter();

  const handleShowJoinedClasses = () => {
    setIsFilterActive(!isFilterActive);
    if (!isFilterActive) {
      setFilteredEvents(events.filter((event) => event.hasJoined));
    } else {
      setFilteredEvents(events);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await apiClient.get<GetClassDto[]>(
        "api/Classes/get-all"
      );
      const classes = response.data;

      const formattedEvents: CalendarEvent[] = classes.map((cls) => ({
        id: cls.id,
        title: `${cls.trainerName} - ${cls.gymName}`,
        start: moment.utc(cls.startDate).local().toDate(),
        end: moment.utc(cls.endDate).local().toDate(),
        allDay: false,
        hasJoined: cls.hasJoined,
        resource: {
          color: cls.color,
          priority: cls.priority,
        },
      }));
      setEvents(formattedEvents);
      setFilteredEvents(formattedEvents);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const fetchTrainers = async () => {
    await apiClient.get<string[]>("api/Trainers/get-all").then((response) => {
      setTrainers(response.data);
    });
  };

  const fetchRole = async () => {
    const role = await getRole();
    setRole(role);
  };

  const handleSelectSlot = (slotInfo: { start: Date; end: Date }) => {
    setSelectedStartDate(slotInfo.start);
    setSelectedEndDate(slotInfo.end);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStartDate(null);
    setSelectedEndDate(null);
  };

  const handleAddEvent = async (classDto: AddClassDto) => {
    setIsLoading(true);
    await apiClient
      .post("api/Classes/add", classDto)
      .then(() => {
        toast.success("Class created successfully!");
        setIsLoading(false);
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data[0] || "Couldn't create a class.";
        toast.error(decodeErrorMessage(errorMessage));
        setIsLoading(false);
      });
    fetchClasses();
    handleCloseModal();
  };

  const closeFitnessPlanModal = () => {
    setIsFitnessPlanModalOpen(false);
  };

  const selectFitnessPlan = async (fitnessPlan: string | null) => {
    if (fitnessPlan) {
      await apiClient
        .put(`api/Users/update-fitness-plan`, { fitnessPlan })
        .then(() => {
          toast.success("Fitness plan updated successfully!");
          closeFitnessPlanModal();
        })
        .catch((error) => {
          toast.error(decodeErrorMessage(error.response.data[0]));
        });
    }
  };

  const checkFitnessPlan = async () => {
    try {
      const response = await apiClient.get<boolean>(
        "api/Users/check-fitness-plan"
      );
      setIsFitnessPlanModalOpen(response.data);
    } catch (error) {
      console.error("Error checking fitness plan:", error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
    fetchRole();
  }, []);

  useEffect(() => {
    if (role === "NormalUser") {
      checkFitnessPlan();
    }
  }, [role]);

  return (
    <>
      {role === "NormalUser" && (
        <>
          <FitnessPlanHeader />
          <PlanSelectModal
            isOpen={isFitnessPlanModalOpen}
            onClose={closeFitnessPlanModal}
            onSubmit={selectFitnessPlan}
          />
        </>
      )}
      <div style={{ height: "80vh", padding: "20px" }}>
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          components={{
            event: EventComponent,
            toolbar: (props) => (
              <CustomToolbar
                {...props}
                onToggleFilter={handleShowJoinedClasses}
                isFilterActive={isFilterActive}
              />
            ),
          }}
          selectable={role === "GymOwner"}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={(event) => router.push(`/home/class/${event.id}`)}
          defaultView="month"
          eventPropGetter={(event) => {
            const backgroundColor = event.resource?.color || "#3174ad";
            return {
              style: {
                backgroundColor,
                borderRadius: "5px",
                color: "white",
                border: "none",
                display: "block",
              },
            };
          }}
          popup
          style={{ height: "100%" }}
        />
        {isModalOpen && selectedEndDate && selectedStartDate && (
          <EventModal
            trainers={trainers}
            isOpen={isModalOpen}
            isLoading={isLoading}
            onClose={handleCloseModal}
            defaultEndDate={selectedEndDate}
            defaultStartDate={selectedStartDate}
            onAddEvent={handleAddEvent}
          />
        )}
      </div>
    </>
  );
};

export default CalendarComponent;
