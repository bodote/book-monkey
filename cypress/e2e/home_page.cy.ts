describe('Home page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('should have a book list show button that can be clicked, leads to the list page with specific books', () => {
    // Interact with the page
    // Assert something about the page content
    cy.title().should('include', 'BookMonkey');
    cy.contains('button', 'list').click();
    cy.url().should('include', '/books/list');
  });
  it('should contain search box that shows 4 books when searched for "test"', () => {
    cy.get('input').type('test').should('have.value', 'test');
    cy.get('table').should('contain', 'Title');
    cy.get('tbody').should('contain', 'Angular');
    cy.get('tr').should('have.length', 7);
  });
});
