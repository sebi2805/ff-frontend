export interface GetClassDto {
  id: string;
  trainerName: string;
  gymName: string;
  color: string;
  startDate: string; // Format ISO
  endDate: string; // Format ISO
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay: boolean;
  resource: {
    color: string;
  };
}

export interface AddClassDto {
  trainerName: string;
  interval: number;
  startDate: string;
  endDate: string;
}
