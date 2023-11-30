import { describe, expect, test } from "vitest";

import { parseLinkValue } from "./estimateSliderHelpers";

describe("parseLinkValue", () => {
  test("returns a single number", () => {
    expect(parseLinkValue("1")).toEqual([1]);
  });

  test("returns a digit number", () => {
    expect(parseLinkValue("0.01")).toEqual([0.01]);
  });

  test("returns multiple numbers", () => {
    expect(parseLinkValue("1 to 2")).toEqual([1, 2]);
  });

  test("returns multiple digit numbers", () => {
    expect(parseLinkValue("0.01 to 0.02")).toEqual([0.01, 0.02]);
  });
});
