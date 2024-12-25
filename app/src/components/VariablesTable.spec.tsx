import { describe, expect, test, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { VariablesTable } from "./VariablesTable";
import { useTables } from "tinybase/debug/ui-react";
import { useRenameNode } from "@/lib/store";

// Mock the hooks
vi.mock("tinybase/debug/ui-react", () => ({
  useTables: vi.fn(),
}));

vi.mock("@/lib/store", () => ({
  useRenameNode: vi.fn(),
  useAddEstimateNode: vi.fn(),
}));

describe("VariablesTable", () => {
  test("appends pasted text to existing name", () => {
    const mockRenameNode = vi.fn();
    (useRenameNode as jest.Mock).mockReturnValue(mockRenameNode);
    (useTables as jest.Mock).mockReturnValue({
      nodes: {
        "1": {
          name: "existing",
          variableName: "a",
          type: "estimate"
        }
      }
    });

    const { getByDisplayValue } = render(<VariablesTable />);
    const textarea = getByDisplayValue("existing");

    // Create a paste event with clipboard data
    const pasteEvent = new Event("paste", { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => " appended"
      }
    });

    fireEvent(textarea, pasteEvent);

    expect(mockRenameNode).toHaveBeenCalledWith({
      id: "1",
      name: "existing appended"
    });
  });

  test("handles paste errors gracefully", () => {
    const mockRenameNode = vi.fn().mockImplementation(() => {
      throw new Error("Test error");
    });
    (useRenameNode as jest.Mock).mockReturnValue(mockRenameNode);
    (useTables as jest.Mock).mockReturnValue({
      nodes: {
        "1": {
          name: "existing",
          variableName: "a",
          type: "estimate"
        }
      }
    });

    const consoleSpy = vi.spyOn(console, 'error');
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const { getByDisplayValue } = render(<VariablesTable />);
    const textarea = getByDisplayValue("existing");

    const pasteEvent = new Event("paste", { bubbles: true });
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => " appended"
      }
    });

    fireEvent(textarea, pasteEvent);

    expect(consoleSpy).toHaveBeenCalled();
    expect(alertSpy).toHaveBeenCalledWith("Failed to paste text. Please try again.");
  });
});
