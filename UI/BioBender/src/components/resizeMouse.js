export default function resizeWithMouse(containerId, triggerId) {

	var container = document.getElementById(containerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;

	document.body.addEventListener('mousemove', function resize(evt) {
		y = evt.screenY;

		ht = y-rec.top-50;

		if (ht > 300) {
			container.style.height = ht + 'px';
		}

		document.body.addEventListener('mouseup', () => {
			document.body.removeEventListener('mousemove', resize)
		})
	})

}


