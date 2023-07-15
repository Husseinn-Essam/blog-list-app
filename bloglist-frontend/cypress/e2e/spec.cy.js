describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "exampleuser",
      username: "exampleuser",
      password: "hashedpassword",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.visit("");
  });
  describe("Login", function () {
    it("Login form is shown when log in is clicked", function () {
      cy.contains("Log in").click();
      cy.contains("username");
      cy.contains("password");
    });
    it("succeeds with correct credentials", function () {
      cy.contains("Log in").click();
      cy.get("#username").type("exampleuser");
      cy.get("#password").type("hashedpassword");
      cy.get("#Log-in").click();
      cy.contains("is logged in");
    });

    it("fails with wrong credentials", function () {
      cy.contains("Log in").click();
      cy.get("#username").type("invaliduser");
      cy.get("#password").type("hashedpassword");
      cy.get("#Log-in").click();
      cy.contains("Wrong username or password");
      cy.get("html").should("not.contain", "invaliduser logged in");
    });
  });
  describe("when logged in", () => {
    beforeEach(function () {
      cy.login("exampleuser", "hashedpassword");
    });
    it("create a blog", () => {
      cy.contains("Create a blog").click();
      cy.get("#title").type("test");
      cy.get("#author").type("test");
      cy.get("#url").type("test");
      cy.get("#create-btn").click();
      cy.get(".blog-list").contains("test");
    });
  });
});
