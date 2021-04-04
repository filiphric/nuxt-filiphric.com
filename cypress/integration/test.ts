it('visits home page and opens blog post', () => {

  cy
    .visit('/')

  cy
    .log('hero element is visible')
    .get('[data-cy="hero"]')
    .should('be.visible');

  cy
    .get('[data-cy="post"]')
    .should('be.visible')
    .should('have.length', 5)
    .eq(0)
    .find('[data-cy="home-blogTitle"]')
    .scrollIntoView()
    .click()

  cy
    .get('[data-cy="blog-title"]')
    .should('be.visible');

  cy
    .log('check blog author')
    .get('[data-cy="blog-author"]')
    .should('be.visible')
    .should('contain.text', 'Filip Hric')

  cy
    .log('check blog reading time')
    .get('[data-cy="blog-readingTime"]')
    .should('be.visible')

  cy
    .log('content is visible')
    .get('[data-cy="blog-content"]')
    .should('be.visible')

});

it('copy code works', () => {

  cy
    .visit('/understanding-code-coverage')

  cy
    .get('.copyButton')
    .eq(0)
    .realClick()

  cy
    .log('code is copied')
    .task('getClipboard')
    .should('eq', 'index.html\napp.js\nstyle.css\n')

});

it('shows posts on search page', () => {

  cy
    .visit('/blog')

  cy
    .get('[data-cy=post]')
    .should('be.visible')
    .should('have.length', 28);

});
