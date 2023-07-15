import axios from "axios";
const baseUrl = "http://localhost:3001/api/login";

const login = async (credentials) => {
  try {
    const response = await axios.post(baseUrl, credentials);
    return response.data;
  } catch (error) {
    console.log(error);
    if (error.response && error.response.status === 401) {
      console.log("error ????");
      throw new Error("Wrong username or password");
    } else {
      throw new Error("Login failed");
    }
  }
};

export default { login };
