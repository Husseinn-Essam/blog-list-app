import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import userService from "../services/userService";
import blogService from "../services/blogs";

const InitializerContext = createContext();

export const useInitializerContext = () => {
  return useContext(InitializerContext);
};

export const InitializerProvider = (props) => {
  const users = useQuery(["users"], userService.getUsers, {
    refetchOnWindowFocus: false,
  });
  const currentBlogs = useQuery(["blogs"], blogService.getAll, {
    refetchOnWindowFocus: false,
  });
  return (
    <InitializerContext.Provider value={{ users, currentBlogs }}>
      {props.children}
    </InitializerContext.Provider>
  );
};
