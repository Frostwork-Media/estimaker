import { useState } from "react";
import { useTables } from "tinybase/debug/ui-react";

import { AnyNode, Tables, useAddEstimateNode, useBulkCreateEstimateNodesWithLinks, useDeleteNode, useRenameNode, useUpdateDerivativeValue,Variable } from "@/lib/store"

import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

interface PreviewEntry {
  name: string
  value: string
}

export function VariablesTable() {
  const [showPreview, setShowPreview] = useState(false);
  const [previewEntries, setPreviewEntries] = useState<PreviewEntry[]>([]);
  const tables = useTables() as Tables;
  const renameNode = useRenameNode();
  const addEstimateNode = useAddEstimateNode();
  const bulkCreateNodes = useBulkCreateEstimateNodesWithLinks();
  const deleteNode = useDeleteNode();
  const updateValue = useUpdateDerivativeValue();
  
  if (!tables?.nodes) return null;

  const variables = Object.entries(tables.nodes)
    .filter((entry): entry is [string, AnyNode] => 'variableName' in entry[1])
    .map(([id, node]): Variable => {
      if (!('variableName' in node)) {
        throw new Error(`Node ${id} missing required variableName`)
      }
      return {
        id,
        name: 'name' in node ? node.name : node.variableName,
        variableName: node.variableName,
        code: 'value' in node ? node.value : '',
        source: '',
        notes: ''
      }
    })
    .filter(Boolean);

  const handleAddEntry = () => {
    try {
      addEstimateNode({ x: 100, y: 100 }); // Add at a fixed position initially
    } catch (error) {
      console.error("Error adding new entry:", error);
      alert("Failed to add new entry. Please try again.");
    }
  };

  const handleAcceptEntries = () => {
    try {
      bulkCreateNodes(previewEntries);
      setShowPreview(false);
      setPreviewEntries([]);
    } catch (error) {
      console.error("Error creating nodes:", error);
      alert("Failed to create entries. Please try again.");
    }
  };

  return (
    <div className="h-full overflow-auto">
      <div className="p-2">
        <div className="flex justify-end mb-4">
          <Button onClick={handleAddEntry} className="mr-2">New Entry</Button>
          <Button onClick={() => setShowPreview(true)} className="mr-2">Paste Entries</Button>
          <Button onClick={() => {
            // Get all unique owner IDs from links
            const owners = new Set<string>();
            Object.values(tables.links || {}).forEach(link => {
              owners.add(link.owner);
            });

            // Create CSV header
            const headers = ['Name', 'Variable', ...Array.from(owners)];
            
            // Create rows
            const rows = variables.map(variable => {
              const row: string[] = [variable.name, variable.variableName];
              owners.forEach(owner => {
                const link = Object.values(tables.links || {}).find(
                  link => link.nodeId === variable.id && link.owner === owner
                );
                row.push(link?.value || '');
              });
              return row;
            });

            // Convert to CSV
            const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
            
            // Download
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'estimates.csv';
            a.click();
            window.URL.revokeObjectURL(url);
          }}>
            Download CSV
          </Button>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Variable</th>
              <th className="text-left p-2">Code</th>
              <th className="text-left p-2">Source</th>
              <th className="text-left p-2">Notes</th>
            </tr>
          </thead>
          <tbody>
            {variables.map((variable) => (
              <tr key={variable.id} className="border-b">
                <td className="p-2">
                  <textarea
                    value={variable.name}
                    onChange={(e) => {
                      try {
                        renameNode({ id: variable.id, name: e.target.value });
                      } catch (error) {
                        console.error("Error renaming node:", error);
                        alert("Failed to rename node. Please try again.");
                      }
                    }}
                    className="w-full p-2 border border-gray-300 rounded resize-none"
                  />
                </td>
                <td className="p-2 font-mono">{variable.variableName}</td>
                <td className="p-2 font-mono">
                  <input
                    type="text"
                    value={variable.code || (('value' in (tables?.nodes?.[variable.id] ?? {}) ? (tables?.nodes?.[variable.id] as {value: string}).value : '') ?? '')}
                    onChange={(e) => {
                      try {
                        updateValue({ id: variable.id, value: e.target.value });
                      } catch (error) {
                        console.error("Error updating code:", error);
                        alert("Failed to update code. Please try again.");
                      }
                    }}
                    className="w-full p-1 border rounded font-mono"
                  />
                </td>
                <td className="p-2">{variable.source}</td>
                <td className="p-2">{variable.notes}</td>
                <td className="p-2">
                  <Button 
                    color={"red" as const}
                    onClick={() => {
                      try {
                        deleteNode(variable.id);
                      } catch (error) {
                        console.error("Error deleting node:", error);
                        alert("Failed to delete node. Please try again.");
                      }
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog open={showPreview} onOpenChange={(open) => {
        if (!open) {
          setShowPreview(false);
          setPreviewEntries([]);
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Paste Variables</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Names</label>
              <textarea
                className="w-full h-48 p-2 border rounded font-mono resize-none overflow-auto"
                placeholder="Paste names here..."
                onChange={(e) => {
                  const names = e.target.value.split('\n').filter(name => name.trim());
                  const values = previewEntries.map(entry => entry.value);
                  const entries = names.map((name, i) => ({
                    name,
                    value: values[i] || ''
                  }));
                  setPreviewEntries(entries);
                }}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Values</label>
              <textarea
                className="w-full h-48 p-2 border rounded font-mono resize-none overflow-auto"
                placeholder="Paste values here..."
                onChange={(e) => {
                  const values = e.target.value.split('\n').filter(value => value.trim());
                  const names = previewEntries.map(entry => entry.name);
                  const entries = names.map((name, i) => ({
                    name: name || '',
                    value: values[i] || ''
                  }));
                  setPreviewEntries(entries);
                }}
              />
            </div>
          </div>
          
          {previewEntries.length > 0 && (
            <div className="mt-4 max-h-48 overflow-auto border rounded">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left p-2 border-b">Name</th>
                    <th className="text-left p-2 border-b">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {previewEntries.map((entry, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2">{entry.name}</td>
                      <td className="p-2">{entry.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          <div className="mt-4 flex justify-end space-x-2">
            <Button color="neutral" onClick={() => setShowPreview(false)}>Cancel</Button>
            <Button color="inverted" onClick={handleAcceptEntries}>Add Entries</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
