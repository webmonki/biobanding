export default function resizeWithMouse(containerId, triggerId) {

	var container = document.getElementById(containerId),
	trigger = document.getElementById(triggerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;


	trigger.addEventListener('mousedown', (evt) => {
		startResize(evt);

		document.body.addEventListener('mousemove', resize);
		document.body.addEventListener('mouseup', () => {
			trigger.removeEventListener('mousedown', resize);
			document.body.removeEventListener('mousemove', resize);
		})
	})

	var startResize = (evt) => {
		y = evt.screenY;

	}

	var resize = (evt) => {
		y = evt.screenY;

		ht = y-rec.top-50;

		if (ht > 300) {
			container.style.height = ht + 'px';
		}
	}
}


