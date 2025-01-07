interface PriorityIconProps {
  priority: string;
  size: string;
}

export const PriorityIcon: React.FC<PriorityIconProps> = ({
  priority,
  size,
}) => {
  switch (priority) {
    case "High":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width={size}
          height={size}
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
          className="bg-white rounded-md"
          width={size}
          height={size}
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
          width={size}
          height={size}
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
