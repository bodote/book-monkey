describe('edit page', () => {
  it('should save the changed author', () => {
    cy.visit('/admin/edit/9783864907791', {
      onBeforeLoad: (window) => {
        cy.stub(window, 'confirm').as('confirm').returns(true);
      }
    });
    cy.contains('h2', 'Edit existing Book:');
    cy.get('form').find('#title').should('have.attr', 'placeholder', 'Title');
    cy.get('@confirm')
      .should('have.been.calledOnce')
      .and('be.calledWith', 'Really want to be Admin?');
    cy.get('form').find('#title').clear();
    cy.get('.alert-error').find('span[data-cy="errorMsg"]');

    cy.get('form').find('#title').type('Another Title');
    cy.get('form').not('.alert');
    cy.get('form').find('button[type="submit"]').click();
    cy.get('form').find('.alert-info');

    // back to list und check if we can see changes there:
    cy.get('a[ng-reflect-router-link="/books/list"]').click();
    cy.get('[data-cy="title/9783864907791"]').should(
      'contain',
      'Another Title'
    );
  });
});
