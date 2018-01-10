import { field } from "form-for";

describe("field annotation", () => {
  let testInstance;

  class TestClass {
    @field({ placeholder: "John Doe" })
    name;

    @field({ type: "number", min: 0 })
    price;
  }

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it("sets schema properties", () => {
    expect(Object.keys(testInstance.schema)).toEqual(["name", "price"]);
  });

  it("does not set the type if not given", () => {
    expect(testInstance.schema.name).toMatchObject({
      placeholder: "John Doe"
    });
  });

  it("sets type when give", () => {
    expect(testInstance.schema.price).toMatchObject({
      type: "number",
      min: 0
    });
  });
});
