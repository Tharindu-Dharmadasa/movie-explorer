import { getYear, formatRating, formatRuntime } from "./formatters";

test("getYear extracts the year", () => {
  expect(getYear("2021-05-03")).toBe("2021");
  expect(getYear("")).toBe("N/A");
});

test("formatRating handles numbers and missing values", () => {
  expect(formatRating(7.456)).toBe("7.5");
  expect(formatRating(0)).toBe("N/A");
});

test("formatRuntime converts minutes", () => {
  expect(formatRuntime(135)).toBe("2h 15m");
  expect(formatRuntime(45)).toBe("45m");
});
