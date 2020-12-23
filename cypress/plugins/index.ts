const clipboardy = require('clipboardy');

module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {

  on('task', {
    // Clipboard test plugin
    getClipboard: () => {
      const clipboard: string = clipboardy.readSync();
      return clipboard;
    },
  });
}