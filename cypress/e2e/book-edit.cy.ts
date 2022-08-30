describe('edit page', () => {
  it('should save the changed author', () => {
    cy.visit('/admin/edit/9783864907791', {
      onBeforeLoad: (window) => {
        cy.stub(window, 'confirm').as('confirm').returns(true);
      }
    });
    cy.contains('h2', 'Edit existing Book:');
    cy.get('form').find('#title');
    cy.get('@confirm')
      .should('have.been.calledOnce')
      .and('be.calledWith', 'Really want to be Admin?');
  });
});
