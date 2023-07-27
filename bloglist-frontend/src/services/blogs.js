import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  try {
    const request = axios.get(baseUrl);
    return request.then((response) => response.data);
  } catch (e) {
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

const update = async (newObj) => {
  const request = await axios.put(`${baseUrl}/${newObj.id}`, newObj);
  const data = await request.data;
  return data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${id}`, config);
};

const comment = async (inputObj) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(
    `${baseUrl}/${inputObj.blogId}/comments`,
    {
      commentText: inputObj.commentText,
      user: inputObj.userId,
    },
    config
  );
  const data = await response.data;
  return data;
};

export default { getAll, create, update, remove, setToken, comment };
