import { useReducer, useContext, createContext } from "react";

const notifReducer = (state, action) => {
  switch (action.type) {
    case "BLOG_CREATION_SUCCESS":
      return `A new blog "${action.payload.title}" by ${action.payload.author}`;
    case "ERROR":
      return "Wrong username or password";
    case "MUTE":
      return "";
    default:
      return "";
  }
};

const NotifContext = createContext();

export const NotifContextProvider = (props) => {
  const [message, dispatchMessage] = useReducer(notifReducer, "");
  return (
    <NotifContext.Provider value={[message, dispatchMessage]}>
      {props.children}
    </NotifContext.Provider>
  );
};
export default NotifContext;
