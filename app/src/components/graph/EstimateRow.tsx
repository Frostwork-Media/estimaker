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

type EstimateRowProps = {
  link: {
    id: string;
    owner: string;
    value: string;
    presence?: {
      avatar?: string;
    };
  };
  variableName: string;
};

export function EstimateRow({ link, variableName }: EstimateRowProps) {
  if (!link.presence?.avatar) {
    throw new Error(`No avatar found for link with value: ${link.value}`);
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-start text-xs text-left gap-2 bg-indigo-50 rounded-full">
        <Avatar avatar={link.presence.avatar} />
        <span className="text-indigo-700 font-mono tracking-tighter text-[11px] text-center grow">
          {link.value}
        </span>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-1 hover:bg-indigo-100 rounded-full transition-colors"
        >
          <ChevronRight size={14} className="text-indigo-700" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Distribution for {variableName}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <SquiggleChart
              code={`${variableName} = ${link.value}`}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}