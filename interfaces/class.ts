export interface GetClassDto {
  id: string;
  trainerName: string;
  gymName: string;
  color: string;
  hasJoined: boolean;
  startDate: string; // Format ISO
  endDate: string; // Format ISO
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  hasJoined: boolean;
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

export interface ClassFormValues {
  trainerName: string;
  interval: string;
  startDate: string;
  endDate: string;
}
