import { createContext } from "react";

import { useSquiggleRunResult } from "../lib/useSquiggleRunResult";

export const SquiggleContext = createContext<
  | (ReturnType<typeof useSquiggleRunResult> & {
      code: string;
    })
  | undefined
>(undefined);
