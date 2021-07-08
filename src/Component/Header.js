import '../Styles/Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'

function Header() {
  return (
    <div className="App_header">
      <div className="Title">Solar Power Plant Monitoring</div>
      <div className="Indicator">
        <FontAwesomeIcon icon={faCircle} />
        <span className="Live">LIVE</span>
      </div>
    </div>
  );
}

export default Header
