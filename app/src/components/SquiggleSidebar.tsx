import { SquiggleViewer } from "@quri/squiggle-components";
import { useContext } from "react";

import { SquiggleContext } from "./SquiggleProvider";

export function SquiggleSidebar() {
  const sq = useContext(SquiggleContext);
  if (!sq) return null;
  const { resultVariables, resultItem, code } = sq;
  return (
    <div className="p-4 grid gap-2">
      <h3 className="text-2xl font-bold text-gray-900">Code</h3>
      <pre className="p-2 rounded bg-neutral-900 text-white max-h-[250px] overflow-auto text-sm">
        <code>{code}</code>
      </pre>
      {resultVariables ? (
        <SquiggleViewer
          resultVariables={resultVariables}
          resultItem={resultItem}
          // Which variable to render???
        />
      ) : null}
    </div>
  );
}
