describe("Visit Markets", () => {
  it("Loads the market page", () => {
    cy.visit("localhost:5173/#/markets");
  });
});
