import React, { useEffect, useState } from "react";
import { Form, ListGroup, CloseButton, Card, FormLabel } from "react-bootstrap";
import stringSimilarity from "string-similarity";

interface Payload {
  employees: string[];
  reviews: {
    author_title: string;
    review_text: string;
    review_rating: number;
    review_datetime_utc: string;
  }[];
}

export default function Employees() {
  const [inputEmployee, setInputEmployee] = useState("");
  const [employees, setEmployees] = useState<string[]>([]);
  const [inputFileName, setInputFileName] = useState("");
  const [file, setFile] = useState<ArrayBuffer | string>();
  const [results, setResults] = useState<Map<string, number>>();
  const [parsedResults, setParsedResults] = useState<any[]>([]);

  const countEmployeesPoints = (payload: Payload) => {
    const map = new Map(
      payload.employees.map((employee) => [employee.toUpperCase(), 0])
    );

    for (const review of payload.reviews) {
      if (!review.review_text) return;

      const comment = review.review_text.toUpperCase();

      for (const employee of payload.employees) {
        const employeeKey = employee.toUpperCase();
        const employeeMatched = comment.includes(employeeKey);

        if (employeeMatched) {
          const employeeStars = map.get(employeeKey) || 0;

          const updatedMap = map.set(employeeKey, employeeStars + 1);
          setResults(updatedMap);
        }
      }
    }
  };

  const _handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (inputEmployee.length > 0) {
        setEmployees([...employees, e.target.value]);
        setInputEmployee("");
      }
    }
  };

  const handleRemoveEmployee = (employee: string) => {
    const newEmployees = [...employees];
    newEmployees.splice(employees.indexOf(employee), 1);
    setEmployees([...newEmployees]);
  };

  const handleSetFile = (e: any) => {
    setFile(undefined);
    setResults(undefined);
    const file = e.target.files[0];
    setInputFileName(file.name);

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");
    fileReader.onload = (e) => {
      const res = e.target?.result;
      if (res) {
        setFile(res);

        const reviews = JSON.parse(res.toString());
        countEmployeesPoints({
          employees,
          reviews,
        });
        setInputFileName("");
        setFile(undefined);
      }
    };
  };

  useEffect(() => {
    console.log(results);
    if (results) {
      const arr: any[] = [];
      results.forEach((res, key) =>
        arr.push({
          key,
          res,
        })
      );

      setParsedResults(arr);
    }
  }, [results]);

  return (
    <>
      {parsedResults.length > 0 && (
        <Card className="p-3">
          <Card.Title>Resultado</Card.Title>
          <Card.Body>
            {parsedResults.map((res) => (
              <p key={res.key}>
                {res.key}: {res.res} pontos
              </p>
            ))}
          </Card.Body>
        </Card>
      )}

      <Form className="my-5" onSubmit={(e) => e.preventDefault()}>
        <Form.Group>
          <Form.Label>Nome do funcionário a ser contabilizado</Form.Label>
          <Form.Control
            placeholder="Digite o nome e aperte ENTER"
            onKeyDown={_handleKeyDown}
            value={inputEmployee}
            onChange={(e) => setInputEmployee(e.target.value)}
          ></Form.Control>
        </Form.Group>
      </Form>

      <ListGroup>
        {employees.length > 0 && <h6>Funcionários adicionados:</h6>}
        {employees.map((employee) => (
          <ListGroup.Item key={employee}>
            <div className="d-flex justify-content-between">
              {employee}
              <CloseButton onClick={() => handleRemoveEmployee(employee)} />
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {employees.length > 0 && (
        <Form className="my-5" onSubmit={(e) => e.preventDefault()}>
          <Form.Group>
            <Form.Label>Insira o arquivo de avaliações</Form.Label>
            <Form.Control
              placeholder={inputFileName || "Selecione o arquivo"}
              type="file"
              onChange={handleSetFile}
            ></Form.Control>
          </Form.Group>
        </Form>
      )}
    </>
  );
}
