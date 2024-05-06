const readCSV = require('../../src/csvReader');
const parseQuery = require('../../src/queryParser');
const executeSELECTQuery = require('../../src/index');

test('Read CSV File', async () => {
    const data = await readCSV('./student.csv');
    expect(data.length).toBeGreaterThan(0);
    expect(data.length).toBe(3);
    expect(data[0].name).toBe('John');
    expect(data[0].age).toBe('30'); //ignore the string type here, we will fix this later
});

test('Parse SQL Query', () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        fields: ["student.name", "enrollment.course"],
        table: "student",
        whereClauses: [],
        joinTable: "enrollment",
        joinCondition: {
            left: "student.id",
            right: "enrollment.student_id"
        }
    });
});

test('Execute SQL Query', async () => {
    const query = 'SELECT id, name FROM student';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
});

test('Parse SQL Query with WHERE Clause', () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id WHERE student.name = John';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        "fields": ["student.name", "enrollment.course"],
        "table": "student",
        "whereClauses": [{
            "field": "student.name",
            "operator": "=",
            "value": "John"
        }],
        "joinTable": "enrollment",
        "joinCondition": {
            "left": "student.id",
            "right": "enrollment.student_id"
        }
    });
});

test('Execute SQL Query with WHERE Clause', async () => {
    const query = 'SELECT id, name FROM student WHERE age = 25';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('id');
});

test('Parse SQL Query with Multiple WHERE Clauses', () => {
    const query = 'SELECT student.name, enrollment.course FROM student INNER JOIN enrollment ON student.id=enrollment.student_id WHERE student.name = John';
    const parsed = parseQuery(query);
    expect(parsed).toEqual({
        "fields": ["student.name", "enrollment.course"],
        "table": "student",
        "whereClauses": [{
            "field": "student.name",
            "operator": "=",
            "value": "John"
        }],
        "joinTable": "enrollment",
        "joinCondition": {
            "left": "student.id",
            "right": "enrollment.student_id"
        }
    });
});

test('Execute SQL Query with Multiple WHERE Clause', async () => {
    const query = 'SELECT id, name FROM student WHERE age = 30 AND name = John';
    const result = await executeSELECTQuery(query);
    expect(result.length).toBe(1);
    expect(result[0]).toEqual({ id: '1', name: 'John' });
});

test('Execute SQL Query with Greater Than', async () => {
    const queryWithGT = 'SELECT id FROM student WHERE age > 22';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('id');
});

test('Execute SQL Query with Not Equal to', async () => {
    const queryWithGT = 'SELECT name FROM student WHERE age != 25';
    const result = await executeSELECTQuery(queryWithGT);
    expect(result.length).toEqual(2);
    expect(result[0]).toHaveProperty('name');
});