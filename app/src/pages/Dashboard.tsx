import { SignOutButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useCreateProject } from "@/lib/mutations";
import { useProjects } from "@/lib/queries";

export default function Dashboard() {
  const createProject = useCreateProject();
  const navigate = useNavigate();
  const projects = useProjects();

  return (
    <div className="p-12 grid gap-4">
      <p className="text-3xl font-extrabold mb-6">estimaker</p>
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Your Projects</h1>
        <Button onClick={() => createProject.mutate()}>Create Project</Button>
      </div>
      {projects.isLoading ? (
        <span>Loading...</span>
      ) : projects.data?.length === 0 ? (
        <span>No projects yet</span>
      ) : (
        projects.data?.map((project) => (
          <Link key={project.id} className="text-lg" to={project.id}>
            {project.name}
          </Link>
        ))
      )}

      <SignOutButton
        signOutCallback={() => {
          navigate("/");
        }}
      >
        <div className="mt-12">Sign Out</div>
      </SignOutButton>
    </div>
  );
}
