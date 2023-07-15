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
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  cy.request({
    url: `${Cypress.env("BACKEND")}/blogs`,
    method: "POST",
    body: { ...blog },
    headers: {
      Authorization: `Bearer ${user.token}`,
    },
  });
  cy.visit("");
});
