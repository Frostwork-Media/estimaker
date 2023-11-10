import { Button } from "@/components/button";

export default function Dashboard() {
  return (
    <div className="p-12">
      <p className="text-3xl font-extrabold mb-6">estimaker</p>
      <h1 className="text-2xl font-bold mb-2">Your Projects</h1>
      <Button>Create Project</Button>
    </div>
  );
}
