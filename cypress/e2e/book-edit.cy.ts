describe('edit page', () => {
  it('should save the changed author', () => {
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
    cy.visit('/admin/edit/9783864907791');
    cy.contains('h2', 'Edit existing Book:');
  });
});
