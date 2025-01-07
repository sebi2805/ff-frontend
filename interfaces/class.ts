export interface GetClassDto {
  id: string;
  trainerName: string;
  gymName: string;
  color: string;
  priority: string;
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
    priority: string;
  };
}

export interface AddClassDto {
  trainerName: string;
  priority: number;
  interval: number;
  startDate: string;
  endDate: string;
}

export interface ClassFormValues {
  trainerName: string;
  interval: string;
  priority: string;
  startDate: string;
  endDate: string;
}
