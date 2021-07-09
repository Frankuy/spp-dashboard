import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Generator from './Component/Generator';
// import Graph from './Component/Graph';
import Header from './Component/Header';
// import Sensor from './Component/Sensor';

function App() {
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
            <Generator />
          </Col>
          {/* <Col md={6}>
            <Row>
              <Col md={12} sm={6}><Sensor width={975} height={450} /></Col>
              <Col md={12} sm={6}><Graph width={975} height={300} margin={margin} /></Col>
            </Row>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
}

export default App;
