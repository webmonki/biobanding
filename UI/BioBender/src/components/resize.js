export default function resize(containerId, triggerId) {
	var container = document.getElementById(containerId),
	trigger = document.getElementById(triggerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;

	trigger.addEventListener('mousedown', (evt) => {
		startResize(evt);

		container.addEventListener('mousemove', resize);
		container.addEventListener('mouseup', () => {
			trigger.removeEventListener('mousedown', resize);
			container.removeEventListener('mousemove', resize);
		})
	})

	var startResize = (evt) => {
		y = evt.screenY;

	}

	var resize = (evt) => {
		y = evt.screenY;

		ht = y-rec.top-50;

		container.style.height = ht + 'px';
	}
}
