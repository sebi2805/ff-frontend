import { CheckIcon } from "@heroicons/react/outline";
import { CalendarEvent } from "../../interfaces/class";
import { PriorityIcon } from "../common/PriorityIcon";

export const EventComponent = ({ event }: { event: CalendarEvent }) => (
  <div className="flex justify-between items-center px-2">
    <div className="flex items-center justify-between">
      <PriorityIcon priority={event.resource.priority} size="24" />
      {event.hasJoined && (
        <CheckIcon className="inline-block h-6 ml-2 w-6 bg-black-dark rounded-md" />
      )}
    </div>
    {event.title}
  </div>
);
