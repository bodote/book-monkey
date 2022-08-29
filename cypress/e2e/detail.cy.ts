describe('details page', () => {
  it('should contain all buttons', () => {
    cy.visit('/books/detail/9783864907791');
    cy.dataCy('deleteBtn').should('have.length', 1);
    cy.get('button[ng-reflect-router-link="/admin/edit,9783864907791"]').should(
      'have.length',
      1
    );

    //.should('include', 'Testgetriebene');
    cy.get('button#editButton')
      .invoke('attr', 'ng-reflect-router-link')
      .should('equal', '/admin/edit,9783864907791');

    cy.get('img').should('have.length', 1);
    //
    let count = 0;
    cy.on('window:confirm', (str) => {
      count += 1;
      switch (count) {
        case 1:
          expect(str).contains('Really want to be');
          return true;
        case 2:
          throw new Error('confirm window should only happen once');
          // reject the confirmation
          return false;
      }
    });
    cy.get('button#editButton').click();
    cy.url()
      .should('contain', '/admin/edit/9783864907791')
      .then(() => expect(count).to.eq(1));
  });
});
