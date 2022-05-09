import foo from "index";

test("foo is foo", () => {
  expect(foo(123)).toEqual(123);
});
