describe('Title', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should have a book list show button that can be clicked, leads to the list page with specific books', () => {
    // Interact with the page
    // Assert something about the page content
    cy.title().should('include', 'BookMonkey');
    cy.contains('button', 'list').click();
    cy.url().should('include', '/books/list');
    cy.get('[data-cy="btn/books/detail"]').eq(1);
    //.should('include', 'Testgetriebene');
    cy.get('button')
      .filter('[ng-reflect-router-link="/books/detail,9783864907791"]')
      .should('contain', 'Details');
    cy.get('span')
      .filter(':contains("978-3864907791")')
      .should('have.length', 1);
  });
});
