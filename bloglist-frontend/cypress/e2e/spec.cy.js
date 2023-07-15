describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", `${Cypress.env("BACKEND")}/testing/reset`);
    const user = {
      name: "exampleuser",
      username: "exampleuser",
      password: "hashedpassword",
    };
    const user2 = {
      name: "exampleuser2",
      username: "exampleuser2",
      password: "hashedpassword",
    };
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user);
    cy.request("POST", `${Cypress.env("BACKEND")}/users/`, user2);
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
  describe("when logged in", function () {
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
    describe("when blog created", function () {
      this.beforeEach(function () {
        const blog = {
          title: "the programmer",
          author: "john cena",
          url: "not.real",
        };
        cy.createBlog(blog);
      });
      it("like button works", () => {
        cy.get("#view").click();
        cy.get(".likes").then(($likes) => {
          const initialLikes = parseInt($likes.text().split(" ")[1]);

          cy.get("#like")
            .click()
            .then(() => {
              cy.wait(5000); //Wait for the request
              cy.get(".likes").then(($updatedLikes) => {
                const updatedLikes = parseInt(
                  $updatedLikes.text().split(" ")[1]
                );
                expect(updatedLikes).to.equal(initialLikes + 1);
              });
            });
        });
      });
      it("remove button appear only to the creator", () => {
        cy.login("exampleuser2", "hashedpassword");
        cy.get("#remove-btn").should("not.exist");
      });
      it("user who created the blog can remove it", () => {
        cy.login("exampleuser", "hashedpassword");
        cy.get("#view").click();
        cy.contains("john bena").should("be.visible");

        cy.get("#remove-btn").click();
        cy.window().then((win) => {
          cy.stub(win, "confirm").returns(true); // Simulate confirmation by returning true
        });
        cy.contains("john cena").should("not.exist");
      });
      it.only("most liked blogs are at the top", () => {
        const blog = {
          title: "the code report",
          author: "john bena",
          url: "not.real",
          likes: 10,
        };
        cy.createBlog(blog);
        cy.get(".blog-list > :first-child").should(
          "contain",
          "the code report"
        );
        cy.get(".blog-list > :eq(1)").should("contain", "the programmer");
      });
    });
  });
});
