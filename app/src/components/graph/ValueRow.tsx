import { SquiggleChart } from "@quri/squiggle-components";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar } from "./Avatar";

type ValueRowProps = {
  // Common props
  value?: string;
  variableName?: string;
  avatar?: string;
  // Style customization
  bgColor?: string;
  textColor?: string;
  // Optional title override
  modalTitle?: string;
  code?: string;
};

export function ValueRow({ 
  value, 
  variableName, 
  avatar,
  bgColor = "bg-indigo-50",
  textColor = "text-indigo-700",
  modalTitle,
  code
}: ValueRowProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className={`flex w-full items-center gap-2 ${bgColor} rounded-full`}>
        {avatar !== undefined && <Avatar avatar={avatar} />}
        <span className={`font-mono tracking-tighter text-[11px] text-center grow ${textColor}`}>
          {value}
        </span>
        <button 
          onClick={() => setIsOpen(true)}
          className={`p-1 hover:bg-opacity-80 rounded-full transition-colors`}
        >
          <ChevronRight size={14} className={textColor} />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{modalTitle || `Distribution for ${variableName}`}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SquiggleChart
              code={code ? code : `${variableName} = ${value}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}