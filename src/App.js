import SignForm from './SignForm/index';
import Popup from './Popup/index';
import { useSelector } from 'react-redux'


function App() {
  const currentUser = useSelector(state => state);

  return (
    <div className="container">
    {!currentUser ?
      <SignForm/>
      :
      <Popup />
      }
    </div>
  );
}

export default App;
