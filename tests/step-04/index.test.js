const readCSV = require("../../src/csvReader");
const { parseQuery } = require("../../src/queryParser");
const executeSELECTQuery = require("../../src/index");

test("Read CSV File", async () => {
  const data = await readCSV("./student.csv");
  expect(data.length).toBeGreaterThan(0);
  expect(data.length).toBe(4);
  expect(data[0].name).toBe("John");
  expect(data[0].age).toBe("30"); //ignore the string type here, we will fix this later
});
test("Parse SQL Query", () => {
  const query =
    "SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id";
  const parsed = parseQuery(query);
  expect(parsed).toEqual({
    fields: ["student.name", "enrollment.course"],
    table: "student",
    whereClauses: [],
    joinCondition: null,
    joinTable: null,
    joinType: null,
    orderByFields: null,
    groupByFields: null,
    hasAggregateWithoutGroupBy: false,
    joinCondition: {
      left: "student.id",
      right: "enrollment.student_id",
    },
    joinTable: "enrollment",
    joinType: "INNER",
  });
});