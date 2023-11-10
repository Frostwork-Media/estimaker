import { ReactNode } from "react";

const colors = {
  indigo: "text-indigo-500",
  emerald: "text-emerald-500",
};

const bgColors = {
  indigo: "bg-indigo-600",
  emerald: "bg-emerald-600",
};

export function Wrapper({
  children,
  color,
  variableName,
  label,
  selected,
}: {
  children: ReactNode;
  color: keyof typeof colors;
  variableName: string;
  label: string;
  selected: boolean;
}) {
  return (
    <div
      className={`text-left bg-white grid p-2 w-48 ${
        colors[color]
      } justify-items-start ${selected ? "outline-4 outline" : ""}`}
    >
      <span
        className={`text-[10px] text-white ${bgColors[color]} font-bold rounded-full w-5 h-5 flex leading-[20px] text-center justify-center absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2`}
      >
        {variableName}
      </span>
      <h2 className="font-bold leading-tight">{label}</h2>
      {children}
    </div>
  );
}
