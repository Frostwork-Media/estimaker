import { createContext } from "react";

import { useSquiggleRunResult } from "../lib/useSquiggleRunResult";

export const SquiggleContext = createContext<
  ReturnType<typeof useSquiggleRunResult> | undefined
>(undefined);

export function SquiggleProvider({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) {
  const runResult = useSquiggleRunResult(code);
  return (
    <SquiggleContext.Provider value={runResult}>
      {children}
    </SquiggleContext.Provider>
  );
}
