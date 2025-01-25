import { ToolbarProps } from "react-big-calendar";
import { CalendarEvent } from "../../interfaces/class";

interface CustomToolbarProps extends ToolbarProps<CalendarEvent> {
  onToggleFilter: () => void;
  isFilterActive: boolean;
}
export const CustomToolbar: React.FC<CustomToolbarProps> = ({
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
