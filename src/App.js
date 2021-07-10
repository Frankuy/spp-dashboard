import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Generator from './Component/Generator';
// import Graph from './Component/Graph';
import Header from './Component/Header';
import Sensor from './Component/Sensor';

function App() {
  const [generator, setGenerator] = React.useState();

  const onClickGenerator = React.useCallback((generator) => {
    setGenerator(generator);
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
                    <Sensor generator={generator} />
                  </Col>
                </Row>
                :
                <div className="detail">
                  Click One Generator To Monitor Sensor
                </div>
              // <Row>
              //   <Col md={12} sm={6}>

              //   </Col>
              // </Row>
            }
            {/* <Col md={12} sm={6}><Graph width={975} height={300} margin={margin} /></Col> */}
          </Col>
        </Row>
      </Container>
    </div >
  );
}

export default App;
