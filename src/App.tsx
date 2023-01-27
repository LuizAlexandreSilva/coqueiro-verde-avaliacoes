import React from 'react';
import { Row, Col } from 'react-bootstrap'
import Employees from './components/Employees';

function App() {
  return (
    <>
      <header className="w-100 py-3">
        <h1 className='text-center'>Coqueiro Verde Avaliações</h1>
      </header>

      <Row className="justify-content-md-center">
        <Col md="auto">
          <Employees />
        </Col>
      </Row>
    </>
  );
}

export default App;
