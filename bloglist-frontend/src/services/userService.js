import axios from "axios";
const baseUrl = "http://localhost:3001/api/users";

const getUsers = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

const addUser = async (user) => {
  try {
    const response = await axios.post(baseUrl, user);
    console.log("user created");
    return response.data;
  } catch (e) {
    console.log(e);
  }
};

export default { getUsers, addUser };
