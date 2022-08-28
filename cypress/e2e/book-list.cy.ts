describe('list page', () => {
  it('should contain the list of books and lead to the details page', () => {
    cy.visit('/books/list');
    cy.get('figure').should('have.length', 8);
    cy.dataCy('btn/books/detail')
      .eq(0)
      .should('have.attr', 'ng-reflect-router-link');
    cy.get('button[ng-reflect-router-link="/books/detail,9783864907791"]');

    cy.dataCy('isbn').should('have.length', 8);
    cy.get('span').should('contain', 'ISBN:');
    cy.get(
      'button[ng-reflect-router-link="/books/detail,9783864907791"]'
    ).click();
    cy.url().should('contain', '/books/detail/9783864907791');
  });
});
