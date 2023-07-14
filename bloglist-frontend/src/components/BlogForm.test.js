import React from "react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { render, screen, fireEvent } from "@testing-library/react";
import BlogForm from "./BlogForm";

describe("blog Form tests", () => {
  test("calls event handler when passed with right props", () => {
    const mockCreateBlog = jest.fn();
    const component = render(<BlogForm createBlog={mockCreateBlog} />);
    const title = component.getByPlaceholderText("title");
    const author = component.getByPlaceholderText("author");
    const url = component.getByPlaceholderText("url");
    const submitBlogButton = component.getByText("Create");
    userEvent.setup();
    userEvent.type(title, "the real");
    userEvent.type(author, "the real");
    userEvent.type(url, "the real");
    fireEvent.click(submitBlogButton);
    expect(mockCreateBlog).toHaveBeenCalledTimes(1);
  });
});
