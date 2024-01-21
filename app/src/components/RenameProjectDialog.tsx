import { useCallback, useState } from "react";
import { useValue } from "tinybase/debug/ui-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useUpdateProjectNameInDB } from "@/lib/mutations";
import { useUpdateProjectName } from "@/lib/store";

import { Button } from "./ui/button";
import { Input } from "./ui/input";

export function RenameProjectDialog({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const projectName = useValue("name");
  const updateProjectName = useUpdateProjectName();
  const { mutateAsync: updateProjectNameInDBMutation, isPending } =
    useUpdateProjectNameInDB();
  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const newName = formData.get("newName") as string;
      if (!newName || newName === projectName) {
        setOpen(false);
        return;
      }

      updateProjectNameInDBMutation({
        id,
        name: newName,
      }).then(() => {
        updateProjectName(newName);
        setOpen(false);
      });
    },
    [id, projectName, updateProjectName, updateProjectNameInDBMutation]
  );
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename the Project</DialogTitle>
          <DialogDescription>
            Enter a new name for the project.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-2" onClick={handleSubmit}>
          <Input
            defaultValue={projectName as string}
            name="newName"
            disabled={isPending}
          />
          <Button isLoading={isPending} disabled={isPending}>
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
