import axios from "axios";
const baseUrl = "http://localhost:3001/api/blogs";
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  try {
    const response = await axios.get(baseUrl);
    return response.data;
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

const like = async (newObj) => {
  try {
    console.log("Sending like request");

    const config = {
      headers: { Authorization: token },
    };

    const response = await axios.put(`${baseUrl}/${newObj.id}`, newObj, config);

    return response.data;
  } catch (error) {
    console.error("Error liking the blog:", error);
    throw error;
  }
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
  return response.data;
};

export default { getAll, create, like, remove, setToken, comment };
