import { IconLoader2 } from "@tabler/icons-react";
import { useEffect } from "react";

import { useCreateProject } from "@/lib/mutations";

let once = true;

export function New() {
  const createProject = useCreateProject();
  useEffect(() => {
    if (once) {
      createProject.mutate();
      once = false;
    }
  }, [createProject]);
  return (
    <div className="h-[100dvh] grid place-items-center text-orange-600">
      <IconLoader2 className="animate-spin w-12 h-12" />
    </div>
  );
}
