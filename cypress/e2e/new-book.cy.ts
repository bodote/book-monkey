describe('new book page', () => {
  beforeEach(() => {
    // delete the book , check server api if its there, if yes delete it
    // so that we can "save" it in the test below sucessfully
    cy.request({
      url: 'https://api4.angular-buch.com/book/1234567891',
      failOnStatusCode: false
    }).then((response) => {
      if (response.status === 404) {
        cy.log(
          "S'ALL GOOD MAN! status 404 means: book already gone, no need to delete it"
        );
      } else {
        cy.request({
          url: 'https://api4.angular-buch.com/book/1234567891',
          failOnStatusCode: false,
          method: 'DELETE'
        }).then((resp) => {
          expect(response.status).equals(200);
        });
      }
    });
  });
  it('post a new book if all input is ok', () => {
    cy.visit('/admin/create', {
      onBeforeLoad: (window) => {
        cy.stub(window, 'confirm').as('confirm').returns(true);
      }
    });
    cy.get('@confirm')
      .should('have.been.calledOnce')
      .and('be.calledWith', 'Really want to be Admin?');
    cy.get('input#title').focus().blur();
    // check error message
    cy.get('[data-cy="errorMsg"]').should('contain', 'Title is required');
    cy.get('input#title').type('This is a test title');
    cy.get('input#isbn').focus().blur();
    cy.get('[data-cy="errorMsg"]').should('contain', 'ISBN Number is required');
    cy.get('[data-cy="errorMsg"]').should('contain', 'ISBN not valid');
    cy.get('input#isbn').type('123');
    cy.get('[data-cy="errorMsg"]').should('contain', 'ISBN not valid');
    cy.get('input#isbn').type('4567891');
    cy.get('button[type="submit"]').should('be.disabled');
    cy.get('[data-cy="author/0"]').type('author zero');
    //cy.get('button[type="submit"]').should('be.enabled').click();
  });
});
