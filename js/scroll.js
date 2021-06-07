function initScroll(appId) {
	const pageLength = document.querySelectorAll('.page').length;
	let scdir;
	let hold = false;

	function scroll(obj) {
		let slength, plength;
		let page;
		let step = 100;
		const vh = window.innerHeight / 100;
		const vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
		if ((this !== undefined && this.id === appId) || (obj !== undefined && obj.id === appId)) {
			page = this || obj;
			plength = parseInt(page.offsetHeight / vh);
		}
		if (page === undefined) return;
		plength = plength || parseInt(page.offsetHeight / vmin);
		slength = parseInt(page.style.transform.replace('translateY(', ''));
		if (scdir === 'up' && Math.abs(slength) < (plength - plength / pageLength)) {
			slength = slength - step;
		} else if (scdir === 'down' && slength < 0) {
			slength = slength + step;
		} else if (scdir === 'top') {
			slength = 0;
		} else if (scdir === 'about') {
			slength = -100;			
		} else if (scdir === 'contact') {
			slength = -200;
		}
		if (hold === false) {
			hold = true;
			page.style.transform = 'translateY(' + slength + 'vh)';
			setTimeout(function() {
				hold = false;
			}, 1000);
		}
	}
	function swipe(obj) {
		let swdir;
		let sX, sY;
		let dX, dY;
		let threshold = 100;
		let slack = 50;
		let allowedTime = 500, elapsedTime, startTime;
		obj.addEventListener('touchstart', function(e) {
			const touches = e.changedTouches[0];
			swdir = 'none';
			sX = touches.pageX;
			sY = touches.pageY;
			startTime = new Date().getTime();
		}, false);

		obj.addEventListener('touchmove', function(e) {
			e.preventDefault();
		}, false);

		obj.addEventListener('touchend', function(e) {
			const touches = e.changedTouches[0];
			dX = touches.pageX - sX;
			dY = touches.pageY - sY;
			elapsedTime = new Date().getTime() - startTime;
			if (elapsedTime <= allowedTime) {
				if (Math.abs(dX) >= threshold && Math.abs(dY) <= slack) {
					swdir = (dX < 0) ? 'left' : 'right';
				} else if (Math.abs(dY) >= threshold && Math.abs(dX) <= slack) {
					swdir = (dY < 0) ? 'up' : 'down';
				}
				if (obj.id === appId) {
					if (swdir === 'up') {
						scdir = swdir;
						scroll(obj);
					} else if (swdir === 'down' && obj.style.transform !== 'translateY(0)') {
						scdir = swdir;
						scroll(obj);

					}
					e.stopPropagation();
				}
			}
		}, false);
	}

	const app = document.getElementById(appId);
	app.style.transform = 'translateY(0)';
	app.addEventListener('wheel', function(e) {
		if (e.deltaY < 0) {
			scdir = 'down';
		}
		if (e.deltaY > 0) {
			scdir = 'up';
		}
		e.stopPropagation();
	});
	app.addEventListener('wheel', scroll);
	swipe(app);
	
	const navEvent = new Event('nav-click');

	const aboutNav = document.querySelector('#about-nav');
	aboutNav.addEventListener('click', function() {
		scdir = 'about';
		app.dispatchEvent(navEvent);
	}, false);

	const contactNav = document.querySelector('#contact-nav');
	contactNav.addEventListener('click', function() {
		scdir = 'contact';
		app.dispatchEvent(navEvent);
	}, false);

	app.addEventListener('nav-click', scroll);
}