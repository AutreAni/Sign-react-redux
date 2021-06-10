import { useSelector, useDispatch } from 'react-redux';
import { removeCurrentUser } from '../actions/currentUser'
import '../css-modules/Popup/style.css';


const Popup = () => {
    const username = useSelector(state => state.username);
    const dispatch  = useDispatch();
    
    const removeUser = () => {
        dispatch(removeCurrentUser());
    }
    return ( 
        <div className = "popup-wrapper">
        <h1>
            Welcome {username}
        </h1>
        <span onClick = {removeUser}>x</span>
        </div>
     );
}
 
export default Popup;