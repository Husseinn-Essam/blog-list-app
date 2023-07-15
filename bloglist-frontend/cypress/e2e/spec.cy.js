describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3001/api/testing/reset");
    const user = {
      name: "exampleuser",
      username: "exampleuser",
      password: "hashedpassword",
    };
    cy.request("POST", "http://localhost:3001/api/users/", user);
    cy.visit("http://localhost:3000");
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
    });
  });
  describe("when logged in", () => {
    beforeEach(function () {
      cy.contains("Log in")
        .click()
        .then(() => {
          cy.get("#username").type("exampleuser");
          cy.get("#password").type("hashedpassword");
          cy.get("#Log-in").click();
          cy.contains("is logged in");
        });
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
