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
import { fitnessPlanToEnum, getRole } from "../../utils/common";
import { decodeErrorMessage } from "../../utils/errorMessages";
import { CustomToolbar } from "./CustomToolBar";
import EventModal from "./EventModal";
import PlanSelectModal from "./FitnessPlan";
import FitnessPlanHeader from "./FitnessPlanHeader";
import { EventComponent } from "./EventComponent";

const localizer = momentLocalizer(moment);

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
        .put(
          `api/Users/update-fitness-plan?fitnessPlan=${fitnessPlanToEnum(
            fitnessPlan
          )}`,
          {}
        )
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
  console.log(role);
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
      <div
        style={{ height: "80vh", padding: "20px", backgroundColor: "white" }}
      >
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
