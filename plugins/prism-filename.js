(function () {

	if (typeof self === 'undefined' || !self.Prism || !self.document) {
		return;
	}

	if (!Prism.plugins.toolbar) {
		console.warn('Show Languages plugin loaded before Toolbar plugin.');

		return;
	}


	Prism.plugins.toolbar.registerButton('filename', function (env) {
    var fileNameText = env.element.parentElement.parentElement.previousElementSibling?.innerText;

    var element = document.createElement('span');
    element.classList.add("fileNameButton")
		element.innerHTML += fileNameText || '';

		return element;
	});

})();
