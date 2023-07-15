const baseUrl = "http://localhost:3001";

Cypress.Commands.add("login", (username, password) => {
  cy.request("POST", `${Cypress.env("BACKEND")}/login`, {
    username,
    password,
  }).then((res) => {
    localStorage.setItem("loggedUser", JSON.stringify(res.body));
    cy.visit("");
  });
});

Cypress.Commands.add("createBlog", (blog) => {
  const user = JSON.parse(localStorage.getItem("loggedBlogappUser"));
  cy.request({
    url: `${Cypress.env("BACKEND")}/api/blogs`,
    method: "POST",
    body: { ...blog },
    headers: {
      Authorization: `bearer ${user.token}`,
    },
  });
  cy.visit("");
});
