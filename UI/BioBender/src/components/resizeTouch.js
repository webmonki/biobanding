export default function resizeWithTouch(containerId, triggerId) {
	var container = document.getElementById(containerId),
	trigger = document.getElementById(triggerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;


	trigger.addEventListener('touchstart', (evt) => {
		startResize(evt);

		document.body.addEventListener('touchmove', resize);
		document.body.addEventListener('touchend', () => {
			trigger.removeEventListener('touchend', resize);
			document.body.removeEventListener('touchmove', resize);
		})
	})

	var startResize = (evt) => {
		y = evt.changedTouches[0].clientY

	}

	var resize = (evt) => {
		y = evt.changedTouches[0].clientY

		ht = y-rec.top;

		if (ht > 300) {
			container.style.height = ht + 'px';
		}
	}
}