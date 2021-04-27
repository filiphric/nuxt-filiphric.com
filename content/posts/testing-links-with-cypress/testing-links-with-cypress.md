---
title: "Testing links with Cypress"
date: 2021-04-26
published: true
slug: "testing-links-with-cypress"
description: "Let’s say you want to test all the links in a navigation bar, ideally in most effective way. In this article I show you some of the most effective ways"
tags: ['cypress', 'links', 'loop', 'href']
---
I often see a testing case when someone needs to test a navigation bar on a page, to make sure that all the links are actually functioning. This is a very nice problem case, where different strategies may be applied. In this article, I’d like to go through these and show you how can you apply them with Cypress.

Let’s first see what are we going to be testing. We have a simple navigation bar that will redirect us to different pages of our site. As is usuall on this blog, you can follow along with [this example on a repo I made](https://github.com/filiphric/testing-links).

```html
<nav>
  <a href="/blog">Blog</a>
  <a href="/about">About</a>
  <a href="/contact">Contact</a>
</nav>
```

With Cypress, we want to test this navigation bar, ideally in most effective way. Let’s start with the simplest flow, basically mimicking a real user testing all the links:

```js
it('click all links', () => {

  cy.visit('/')

  // blog page
  cy.contains('blog').click()
  cy.location('pathname').should('eq', '/blog')
  cy.go('back')

  // about page
  cy.contains('about').click()
  cy.location('pathname').should('eq', '/about')
  cy.go('back')

  // contact page
  cy.contains('contact').click()
  cy.location('pathname').should('eq', '/contact')
  cy.go('back')

});
```

With each link we click on a link, check redirect url and then we go back to our home page, and repeat the process. This is of course a little repetetive and you can see it in the code itself. Also, if we were to add another item to our navigation bar, we’d need to repeat all of the actions again in our code.

Instead of this, we can create a loop and iterate through our items.

```js {3}
it('click all links with loop', () => {

  const pages = ['blog', 'about', 'contact']

  cy.visit('/')

  pages.forEach(page => {

    cy.contains(page).click()
    cy.location('pathname').should('eq', `/${page}`)
    cy.go('back')

  })

});
```

In this test, we create an array (line 3) and then we create a `forEach` loop that will iterate through the array and repeats the action. This is especially useful if for any reason our navigation bar changes items. We’ll just add an item to the array and our test works.

Although made our test more DRY, there’s a slight problem with this `.go('back')` approach. We are not waiting for our page to fully load. After the assertion on `pathname` passes, we go straight back. Although the main focus of our test is the navigation bar, we still want to see if the links open the correct page and we are not race conditioning. Gleb Bahmutov [has written a great blog on this topic](https://www.cypress.io/blog/2020/08/17/when-can-the-test-navigate/). We really don’t want to test too fast, because we might be missing an error.

And we are! Notice there’s not `about` page. Clicking on the `about` link will actually redirect us to a 404 page. Although our navigation bar might seem like it is working, it can in fact contain a broken link. That’s no good.

We can choose a different approach, and instead of opening our link using `.request()` command. This might sound strange - why would you do an API request to a website? But http request is the exact same thing that your browser does when you type in a url. The only difference is, that as a response, you usually get an html document, instead of json object. You will still get a 200 or 404 status code, so the principle is exactly the same. Now, instead of entering the site with our browser, we just make a request to check that the link is acutally live.

```js
it('use requests to navigation bar links', () => {

  const pages = ['blog', 'about', 'contact']

  cy.visit('/')

  pages.forEach(page => {

    cy
      .contains(page)
      .then((link) => {
        cy.request(link.prop('href'))
      })

  })

});
```

This will help us reveal the error on `about` page, because we will get a 404 error. As a bonus, you get to test URLs that direct outside your superdomain, which is a current limitation with Cypress. You cannot visit multiple domains, but you can do requests to them and that might be good enough for your use case. I write more about this in my blog on <nuxt-link to="/opening-a-new-tab-in-cypress">how to test tab opening in Cypress</nuxt-link>.

As a last example, let’s say we don’t know for sure how many links does our navbar have. We just want to be absolutely sure that each one of them works. To do that, we can easily just select all `<a>` elements and iterate through them:


```js
it('check all links on page', () => {

  cy.visit('/')
  cy.get('a').each(page => {
    cy.request(page.prop('href'))
  })

});
```
This would of course struggle with links that point to email addresses, so in order to skip those, you can change the selector to avoid those:

```js {4}
it('check all links to sites', () => {

  cy.visit('/')
  cy.get("a:not([href*='mailto:'])").each(page => {
    cy.request(page.prop('href'))
  })

});
```

Hope you learned something new. I try to post an article like this every week, so make sure to enter your email in the footer and I will notify you when a new article comes out. You can also follow me on [Twitter](https://twitter.com/filip_hric/) and [LinkedIn](https://www.linkedin.com/in/filip-hric-11a5b1126/).