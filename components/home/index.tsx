"use client";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
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

const localizer = momentLocalizer(moment);

const CalendarComponent: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [trainers, setTrainers] = useState<string[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const fetchClasses = async () => {
    try {
      const response = await apiClient.get<GetClassDto[]>(
        "api/Classes/get-all"
      );
      const classes = response.data;
      const formattedEvents: CalendarEvent[] = classes.map((cls) => ({
        id: cls.id,
        title: `${cls.trainerName} - ${cls.gymName}`,
        start: new Date(cls.startDate),
        end: new Date(cls.endDate),
        allDay: false,
        resource: { color: cls.color },
      }));
      setEvents(formattedEvents);
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
    setSelectedDate(slotInfo.start);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
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
        events={events}
        startAccessor="start"
        endAccessor="end"
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
      {isModalOpen && selectedDate && (
        <EventModal
          trainers={trainers}
          isOpen={isModalOpen}
          isLoading={isLoading}
          onClose={handleCloseModal}
          defaultDate={selectedDate}
          onAddEvent={handleAddEvent}
        />
      )}
    </div>
  );
};

export default CalendarComponent;
