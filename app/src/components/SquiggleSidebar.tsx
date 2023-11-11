import { SquiggleViewer } from "@quri/squiggle-components";
import { useContext } from "react";

import { SquiggleContext } from "./SquiggleProvider";

export function SquiggleSidebar() {
  const sq = useContext(SquiggleContext);
  if (!sq) return null;
  const { resultVariables, resultItem } = sq;
  if (!resultVariables) return null;
  return (
    <div>
      <SquiggleViewer
        resultVariables={resultVariables}
        resultItem={resultItem}
        // Which variable to render???
      />
    </div>
  );
}
