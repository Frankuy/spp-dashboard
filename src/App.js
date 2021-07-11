import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Generator from './Component/Generator';
import Graph from './Component/Graph';
import Header from './Component/Header';
import Sensor from './Component/Sensor';

function App() {
  const [generator, setGenerator] = React.useState();
  const [sensor, setSensor] = React.useState();

  const onClickGenerator = React.useCallback((generator) => {
    setGenerator(generator);
  }, []);

  const onClickSensor = React.useCallback((sensor) => {
    setSensor(sensor);
  }, []);

  return (
    <div className="App">
      <Container fluid>
        <Row>
          <Col>
            <Header />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <Generator onClick={onClickGenerator} />
          </Col>
          <Col md={6}>
            {
              generator
                ?
                <Row>
                  <Col md={12} sm={6}>
                    <Sensor generator={generator} onClick={onClickSensor} />
                  </Col>
                  <Col md={12} sm={6}>
                    {
                      sensor && <Graph sensor={sensor} />
                    }
                  </Col>
                </Row>
                :
                <div className="detail">
                  Click One Generator To Monitor Sensor
                </div>
            }
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
