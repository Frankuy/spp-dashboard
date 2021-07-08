import './App.css';
import Generator from './Component/Generator';
import Graph from './Component/Graph';
import Header from './Component/Header';
import Sensor from './Component/Sensor';

function App() {
  var margin = {top: 10, right: 30, bottom: 30, left: 60}
    
  return (
    <div className="App">
      <Header />
      <Generator width={975} height={810} />
      <Sensor width={975} height={300} />
      <Graph width={975} height={300} margin={margin} />
    </div>
  );
}

export default App;
