export const TextReveal: React.FC<{ text: string }> = ({ text }) => {
  return (
    <>
      <h1 className="overflow-hidden text-2xl font-bold leading-6 text-black-light">
        {Array.from(text).map((char, index) => (
          <span
            className="animate-text-reveal inline-block [animation-fill-mode:backwards]"
            key={`${char}-${index}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
    </>
  );
};
