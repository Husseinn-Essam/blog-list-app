import { useContext } from "react";
import NotifContext from "./NotifContext";

import notificationStyles from "../styles/notification.module.css"; // Replace with your CSS module import

const Notification = () => {
  const [message] = useContext(NotifContext);

  if (!message) return null;

  const isSuccessNotif = message.startsWith("Wrong") ? false : true;
  const notificationClass = isSuccessNotif
    ? notificationStyles.success
    : notificationStyles.error;

  return (
    <div className={`${notificationStyles.notification} ${notificationClass}`}>
      {message}
    </div>
  );
};

export default Notification;
