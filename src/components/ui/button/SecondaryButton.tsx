import { type ReactNode } from "react";

interface Props {
  onClick?: () => void;
  children: ReactNode;
}

export default function SecondaryButton({ onClick, children }: Props) {
  return (
    <div className="bg-brand-gradient p-px rounded-full inline-flex">
      <button
        onClick={onClick}
        className="bg-white flex items-center gap-1.5 text-sm rounded-full px-3 py-1.5"
      >
        {children}
      </button>
    </div>
  );
}
