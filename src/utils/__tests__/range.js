import range from "../range.js";

describe("Range function", () => {
  it("Range from 0 to 10", () => {
    const result = range(0, 10);

    expect(result.length).toBe(10);
    expect(result).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});
