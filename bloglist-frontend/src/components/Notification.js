import { useContext } from "react";
import NotifContext from "./NotifContext";

const Notification = () => {
  const [message, dispatchMessage] = useContext(NotifContext);
  const styles = {
    succNotif: {
      color: "green",
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px",
    },
    errNotif: {
      color: "red",
      background: "lightgrey",
      fontSize: "20px",
      borderStyle: "solid",
      borderRadius: "5px",
      padding: "10px",
      marginBottom: "10px",
    },
  };
  if (message === "") return null;
  if (message) {
    const notificationStyle = message.startsWith("Wrong")
      ? styles.errNotif
      : styles.succNotif;
    return <div style={notificationStyle}>{message}</div>;
  }
};

export default Notification;
