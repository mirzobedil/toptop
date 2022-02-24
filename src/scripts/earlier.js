'use strict';

(function () {
	const theme = window.localStorage.getItem('theme');
	if (window.localStorage.getItem('theme')) {
		document.documentElement.dataset.theme = theme;
	}
	else {
		window.localStorage.clear();
		window.localStorage.setItem('theme', 'light');
	}
})();