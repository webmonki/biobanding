export default function resizeWithTouch(containerId, triggerId) {
	var container = document.getElementById(containerId),
	trigger = document.getElementById(triggerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;

	document.body.addEventListener('touchmove', function resize(evt) {
		y = evt.changedTouches[0].clientY

		ht = y-rec.top-50;

		if (ht > 300) {
			container.style.height = ht + 'px';
		}

		document.body.addEventListener('touchend', () => {
			document.body.removeEventListener('touchmove', resize)
		})
	})
}