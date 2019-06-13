import get from "../get.js";

describe("Get function", () => {
  it("Get should return undefined", () => {
    const object = {};

    expect(get(object, "test")).toBe(undefined);
    expect(get(object, "")).toBe(undefined);
    expect(get(object)).toBe(undefined);
  });

  it("Get should return the correct value", () => {
    const object = { test: 3 };

    expect(get(object, "test")).toBe(3);
  });

  it("Deep get should return the correct value", () => {
    const object = { test: { deepTest: 3 } };

    expect(get(object, "test.deepTest")).toBe(3);
  });
});
