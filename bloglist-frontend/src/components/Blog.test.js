import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, fireEvent } from "@testing-library/react";
import Blog from "./Blog";

const blog = {
  title: "gg",
  author: "parrot",
  likes: 4,
  url: "op.gg",
};
const user = {
  username: "rose",
};
describe("blog list testing", () => {
  describe("testing toggle details", () => {
    test("rendering author and title and not details", () => {
      const component = render(<Blog blog={blog} user={user} />);
      const blogHead = component.container.querySelector(".blogHead");
      expect(blogHead).toBeDefined();
      expect(blogHead).toBeVisible();
      expect(blogHead.textContent).toContain(`${blog.title}`);
      expect(blogHead.textContent).toContain(`${blog.author}`);

      expect(blogHead.textContent).not.toContain(`${blog.url}`);
      expect(blogHead.textContent).not.toContain(`${blog.likes}`);
    });
    test("shows details when button is clicked", () => {
      const component = render(<Blog blog={blog} user={user} />);
      const buttonDetails = component.container.querySelector("#view");
      fireEvent.click(buttonDetails);
      screen.debug();
      const urlElement = component.getByText(blog.url);
      expect(urlElement).toBeInTheDocument();

      const likesElement = component.getByText(`Likes: ${blog.likes}`);
      expect(likesElement).toBeInTheDocument();
    });
  });
  describe("testing the like feature", () => {
    test("event handler is called twice", () => {
      const mockLikeBlog = jest.fn();
      const component = render(
        <Blog blog={blog} user={user} likeBlog={mockLikeBlog} />
      );

      const buttonDetails = component.container.querySelector("#view");
      fireEvent.click(buttonDetails);
      const likeButton = component.container.querySelector("#like");
      screen.debug();
      fireEvent.click(likeButton);
      fireEvent.click(likeButton);
      expect(mockLikeBlog).toHaveBeenCalledTimes(2);
    });
  });
});
