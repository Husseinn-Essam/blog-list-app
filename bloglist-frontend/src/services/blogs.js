import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  console.log("yeses");
  try {
    console.log("i got here");
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
  } catch (e) {
    console.log("uh");
    console.log(e);
  }
};

const create = async (newObj) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, newObj, config);
  return response.data;
};

const update = async (id, newObj) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObj);
  const data = await request.data;
  return data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };

  await axios.delete(`${baseUrl}/${id}`, config);
};

export default { getAll, create, update, remove, setToken };
