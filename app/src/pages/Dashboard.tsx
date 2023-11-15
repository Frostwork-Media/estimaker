import { SignOutButton } from "@clerk/clerk-react";
import {
  IconArrowDown,
  IconArrowUp,
  IconArrowUpRight,
  IconTrash,
} from "@tabler/icons-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import type { Project } from "db";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Button, IconButton } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCreateProject, useDeleteProject } from "@/lib/mutations";
import { useProjects } from "@/lib/queries";

export default function Dashboard() {
  const createProject = useCreateProject();
  const navigate = useNavigate();
  const projects = useProjects();

  return (
    <div className="p-12 grid gap-4">
      <header className="flex justify-between mb-6 items-center">
        <p className="text-3xl font-extrabold">estimaker</p>
        <SignOutButton
          signOutCallback={() => {
            navigate("/");
          }}
        >
          <span className="text-neutral-400 font-bold hover:text-neutral-500 cursor-pointer">
            Sign Out
          </span>
        </SignOutButton>
      </header>
      <div className="flex items-center gap-4">
        <h1 className="text-4xl font-bold">Your Projects</h1>
        <Button
          onClick={() => createProject.mutate()}
          isLoading={createProject.isPending}
        >
          Create Project
        </Button>
      </div>
      {projects.isLoading ? (
        <span>Loading...</span>
      ) : projects.data?.length === 0 ? (
        <span>No projects yet</span>
      ) : projects.data ? (
        <ProjectList projects={projects.data} />
      ) : null}
    </div>
  );
}
function getColumns({
  deleteProject,
}: {
  deleteProject: ReturnType<typeof useDeleteProject>;
}): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: (cell) => (
        <Link
          to={`/projects/${cell.row.original.id}`}
          className="opacity-70 hover:opacity-100 flex items-center gap-2"
        >
          {cell.getValue() as string}
          <IconArrowUpRight className="ml-2 w-4 h-4" />
        </Link>
      ),
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span>Updated</span>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {column.getIsSorted() === "asc" ? (
                <IconArrowDown className="w-4 h-4" />
              ) : (
                <IconArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
      accessorFn: (row) => {
        return format(new Date(row.updatedAt), "Pp");
      },
      sortingFn: (a, b) => {
        return (
          new Date(b.original.updatedAt).getTime() -
          new Date(a.original.updatedAt).getTime()
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <div className="flex items-center gap-2">
            <span>Created</span>
            <button
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              {column.getIsSorted() === "asc" ? (
                <IconArrowDown className="w-4 h-4" />
              ) : (
                <IconArrowUp className="w-4 h-4" />
              )}
            </button>
          </div>
        );
      },
      accessorFn: (row) => {
        return format(new Date(row.createdAt), "Pp");
      },
      sortingFn: (a, b) => {
        return (
          new Date(b.original.createdAt).getTime() -
          new Date(a.original.createdAt).getTime()
        );
      },
    },
    // add a column for deleting projects
    {
      accessorKey: "id",
      header: "",
      cell: (cell) => (
        <IconButton
          icon={IconTrash}
          onClick={() => {
            // console log id
            const projectId = cell.getValue() as string;
            if (
              !window.confirm("Are you sure you want to delete this project?")
            )
              return;
            deleteProject.mutate(projectId);
          }}
        />
      ),
    },
  ];
}

function ProjectList({ projects }: { projects: Project[] }) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "updatedAt",
      desc: false,
    },
  ]);
  const deleteProject = useDeleteProject();
  const columns = useMemo(() => getColumns({ deleteProject }), [deleteProject]);
  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  return (
    <div className="bg-white p-3 rounded-md shadow-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
