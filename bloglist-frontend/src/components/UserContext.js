import { useReducer, useContext, createContext } from "react";
import { useNavigate } from "react-router-dom";
const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        client: action.payload,
        isLoggedin: true,
      };
    case "LOGOUT":
      return {
        ...state,
        client: null,
        isLoggedin: false,
      };
    default:
      return {
        client: null,
        isLoggedin: false,
      };
  }
};

const UserContext = createContext();

export const UserContextProvider = (props) => {
  const [user, dispatchUserAction] = useReducer(userReducer, {
    client: null,
    isLoggedin: false,
  });
  return (
    <UserContext.Provider value={[user, dispatchUserAction]}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
