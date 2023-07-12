const Notification = ({ succMessage, errMessage }) => {
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
  if (succMessage) {
    return <div style={styles.succNotif}>{succMessage}</div>;
  } else if (errMessage) {
    return <div style={styles.errNotif}>{errMessage}</div>;
  }
  return null;
};

export default Notification;
