---
title: "Testing email flows with Mailosaur"
date: 2019-09-13
published: true
slug: "testing-email-flows-with-mailosaur"
description: "How to test e2e flows that require email to be opened. Code demonstration using Mailosaur."
tags: ['cypress', 'email testing']
---
<tweet id="977018512689455106" class="grid justify-center my-8"></tweet>

In this second Cypress tip I would like to give you a glimpse of how we use Cypress with a tool called [Mailosaur](https://mailosaur.com/).

## Telling the whole story

When writing tests, I like to resemble user behavior as much as possible. In other words,** I want to tell the whole story.**

Let me give you an example. Let’s say you forgot your password to your Slido account. Here is what you would do as a user. You would:

1. go to reset login page and request password reset
2. receive an email with a reset link
3. visit that link
4. type in your new password
5. log in with new password

With Cypress, you can easily take care of step 1. But getting to step 3 requires opening an email inbox, which is not something you can easily do (or want to do) in a test.

Normally, this is something you would solve on staging environment, by either creating a special setup, where you can access the information you need. But that is something that user does not do, so it does not resemble the user. You can of course make sure that every part of the functionality works (which is good), but if you are like me, you’ll feel like that’s not enough.

## Enter Mailosaur

[Mailosaur](https://mailosaur.com/) a service that creates an email inbox for you. What’s special about it is, that you can access it not only via their interface, but also via their API. All of email content and metadata can be viewed in plain text, HTML, or parsed to JSON, where you can view all links, attachments or images.

My favourite part is the ability to [wait for a specific message to arrive](https://docs.mailosaur.com/reference#wait-for-a-specific-message). This means you can access all of that information within few milliseconds and then use them further in your test.

With Mailosaur, you create an email server, where all emails with specific username land. You’ll end up with something like:

    {{any string here}}.abcdefg@mailosaur.io

## Integrating Mailosaur with Cypress

Since you can get all of the information you need just by calling a simple http request, you can do exactly that — by using Cypress [cy.request() command](https://docs.cypress.io/api/commands/request.html#Syntax). You can then make assertions on returned response, or use that data for further test execution.

```js
const userEmail = 'email.abcdefg@mailosaur.io'

describe('Reset password flow', () => {

  it('Should receive an email and use reset password link', () => {

    // trigger reset password for user
    // this command is equal to clicking „I forgot my password“ link and entering user email
    cy
      .userPasswordReset(userEmail)

    cy
      .request({
        method: 'POST',
        url: 'https://mailosaur.com/api/messages/await?server=abcdefg', // abcdefg is server name
        headers: {
        authorization: Cypress.env('mailosaurAuth')
      },
        body: {
          'sentTo': userEmail,
          'subject': 'Password reset'
        }
    }).then( response => {

      // continue with test, open link
      cy
        .visit(response.body.text.links[1])

      // fill in and confirm new password
      cy
        .get('#password')
        .type(newPassword);

      cy
        .get('#passwordConfirm')
        .type(newPassword);

      cy
        .get('#reset-change-password-btn')
        .should('be.visible')
        .should('be.enabled')
        .click();

      // land on desired page after confirming password reset
      cy
        .location('href')
        .should('contains', '/login');

      // login with my new password
      // ...

    })

  });

});
```
After obtaining the reset password link, you can continue with your test journey. Opening link, setting up new password, and then finally logging in to application. This resembles real life behavior more closely, connecting and integrating each step.
