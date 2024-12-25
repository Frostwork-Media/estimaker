import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function PromptDialog() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setLoading(true);
    try {
      const response = await fetch("/api/prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error("Failed to generate graph");
      }
      // For now just log the response
      const data = await response.json();
      console.log('Prompt Response:', data);
      if (data.response) {
        console.log('LLM Output:', data.response);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create from Prompt</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Graph from Prompt</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-32 p-2 border rounded"
            placeholder="Describe the graph you want to create..."
          />
          <Button onClick={handleSubmit} disabled={!prompt || loading}>
            {loading ? "Generating..." : "Generate Graph"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
