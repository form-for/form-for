import { field } from "../../index";

describe("Field decorator", () => {
  let testInstance;

  class TestClass {
    @field name;

    @field({ placeholder: "Doe" })
    surname;

    @field({ type: "number", min: 0 })
    money;
  }

  beforeEach(() => {
    testInstance = new TestClass();
  });

  it("sets only schema properties", () => {
    expect(Object.keys(testInstance.schema)).toEqual(["name", "surname", "money"]);
  });

  it("sets schema property without parameters", () => {
    expect(testInstance.schema.name).toMatchObject({});
  });

  it("does not set the type if not given", () => {
    expect(testInstance.schema.surname).toMatchObject({
      placeholder: "Doe"
    });
  });

  it("sets type when give", () => {
    expect(testInstance.schema.money).toMatchObject({
      type: "number",
      min: 0
    });
  });
});
