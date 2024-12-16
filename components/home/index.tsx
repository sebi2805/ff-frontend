"use client";
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
import EventModal from "./EventModal";
import { decodeErrorMessage } from "../../utils/errorMessages";
import { CheckIcon } from "@heroicons/react/outline";

interface CustomToolbarProps extends ToolbarProps<CalendarEvent> {
  onToggleFilter: () => void;
  isFilterActive: boolean;
}

const localizer = momentLocalizer(moment);

const EventComponent = ({ event }: { event: CalendarEvent }) => (
  <div className="flex justify-between items-center px-2">
    {event.title}{" "}
    {event.hasJoined && (
      <CheckIcon className="inline-block h-4 w-4 bg-black-dark rounded-md" />
    )}
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
        resource: { color: cls.color },
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

  useEffect(() => {
    fetchClasses();
    fetchTrainers();
    fetchRole();
  }, []);

  return (
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
  );
};

export default CalendarComponent;
