---
slug: testing-websocket-application-with-cypress
date: 2020-10-19
title: 'Testing a websocket application with Cypress'
categories: ['test', 'websockets', 'socket.io', 'cypress', 'cypress.io']
keywords: ['test', 'websockets', 'socket.io', 'cypress', 'cypress.io']
published: true
---
Websockets enable you to have an uninterrupted communication with your server. Typically, you can see websockets in action when using a chat app. Without needing to refresh, you can see your friend’s messages arrive. Websocket connection is typically created when you open your application. In my [Trello clone app](https://github.com/filiphric/trelloapp), you can see a websocket connection being created upon refreshing our application:

<video alt="Websockets shown in devtools" src="websockets.mp4"></video>

As you can see, we can access our websockets in the Chrome DevTools network panel. Websockets are sort of permanent connection between client and server. Communication happens through websocket messages. These messages can be both sent and received. To observe these messages, you can again look into Chrome DevTools. In our example, there are two windows open. See how a message appears in the websocket detail panel when we create a new board in a second window:

<video alt="Websocket message appears on board creation" src="websocket_message.mp4"></video>

The websocket communication can go two ways, sort of like a chat would. Websocket messages can either be sent to the server, or they can be received from the server. Our Trello application only does the latter. There are no websockets being sent, only received. When creating a new board, an http request is made, and server then emits a websocket message to all opened clients (apps). That means that all instances of our Trello application will receive the websocket message, digest it and change state of our application. In our case, you can see that our newly created board appears in second window, without needing to refresh the application.

## Let’s test websocket behavior
Let’s say we want to write a test for what we just saw in the animation. We want to create a test that checks that a websocket message that arrives when a new board is created in other window. In Cypress, it is not possible to open a second tab or a window for that. ([I recommend checking out my blog on what you can do when dealing with tabs](https://filiphric.com/opening-a-new-tab-in-cypress)). The fact of the matter is, that you don’t need a second tab. Your app is not aware of other browser window being opened, so you can test your app effectively without trying to do so.

Instead, let’s look into more detail of what happens when a board is created in another window:
1. User clicks on a button to create a new board
2. Fills an input field with the name of the board
3. Our app takes that input and sends it in the body of our http request
4. Our app takes the user to the board

In our first window, we can see the new board appearing at step #3. So it seems we can really just replicate what happens in this step. A simple request will do exactly the same thing our app in first window expects.

```js
cy
  .visit('/')

cy
  .request('POST', '/api/boards', { name: 'new board' })
```
When this test runs, the exact same thing as in our previous gif happens. New board magically appears in our board list. Arguably, to test if our websockets work, we can just check that our application renders our new board:
```js
cy
  .get('.board_item')
  .should('be.visible')
  .and('have.length', 1);

```

This will provide a good insight into correct functioning of our websockets. However, upon examining our websocket message we can see that the name of our new board is not the only thing that is sent. There are couple of things that may be hard to check via UI, like `boardId` or id of the user that created the board. `boardId` is actually very important for our app, since it is used for redirecting user after clicking on the board.

## Diving deeper
As of Cypress v5.4.0, there is no way we can spy on incoming/outgoing websocket in similar fashion as for xhr, fetch requests or static assets (I write about routing [fetch requests and static assets here](https://filiphric.com/playing-with-experimental-network-stubbing)). What we can do however, is leveraging the fact our tests run in the same context as our app. We can look inside our application and look into whether our application actually digests our websocket message properly.

Our application is written in Vue and if you have ever written an application in Vue, you may have used [Vue.js DevTools](https://chrome.google.com/webstore/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd?hl=en). These provide insight into components, application store and so much more. Using Vue.js DevTools you can see how our app adds our newly created board into store once websocket message arrives.
<video alt="vue.js devtools" src="vuejs_devtools.mp4"></video>
How cool would it be if we could test against these DevTools? Well, you kind of can, although the magic does not happen inside the extension, but in your browser console. We can expose our Vue app to the context of our window and have direct access into our app from within tests. Notice how we expose it only from within context of Cypress window.

```js {5-7}
const app = new Vue({
  // ...
}).$mount('#trello-app');

if (window.Cypress) {
  window.app = app;
}
```
Once we have added this code into our app, we can access our app via `.window()` command in Cypress. To see it in our console, we can just use `console.log()` command.
```js
cy
  .window()
  .then(({ app }) => {
    console.log(app);
  });
```
<video alt="Vue app exposed in console" src="vue.mp4"></video>
This is really cool way we can look into our application state and observe whether it reacts accordingly to our websocket message. This way we can go one level deeper and check for various attributes that are received via websocket message. Notice how we use `.should()` instead of `.then()` command on line 3. This applies Cypress’ retry logic to our assertion, so that we can account for delay between our request and actual arrival of our websocket message.

```js {3}
cy
  .window()
  .should(({ app }) => {
    // find our component by component name
    const boardCollection = app.$children.find(e => e.$options.name === 'board-collection');
    expect(boardCollection.boards).to.have.length(1);
    expect(boardCollection.boards[0].id).to.exist;
    expect(boardCollection.boards[0].starred).to.be.false;
    expect(boardCollection.boards[0].user).to.eq(0);
  });

```
The cool part here, is that we can actually test parts of our app that we are not able to see. That way we have not only tested that our websockets have actually arrived, but more importantly, that these websocket messages were properly handled.

I strongly encourage you to try this on your own. You can use my [Trello clone app](https://github.com/filiphric/trelloapp), or on some other. While you are out there checking out apps, I suggest looking into [Real World app by Cypress](https://github.com/cypress-io/cypress-realworld-app). It has tons of cool examples.

Don’t forget to share this blog with a friend.