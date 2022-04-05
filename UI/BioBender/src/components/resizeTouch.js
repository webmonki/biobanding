export default function resizeWithTouch(containerId, triggerId) {
	console.log("TOUCH")
	var container = document.getElementById(containerId),
	trigger = document.getElementById(triggerId),
	y,
	rec = container.getBoundingClientRect(),
	ht = rec.bottom-rec.top;


	trigger.addEventListener('touchstart', (evt) => {
		startResize(evt);
		console.log("TOUCH 2")

		document.body.addEventListener('touchmove', resize);
		document.body.addEventListener('touchend', () => {
			console.log("END")
			trigger.removeEventListener('touchend', resize);
			document.body.removeEventListener('touchmove', resize);
		})
	})

	var startResize = (evt) => {
		console.log("Start REIZSE")
		y = evt.changedTouches[0].clientY

	}

	var resize = (evt) => {
		console.log("RESIZE")
		y = evt.changedTouches[0].clientY

		ht = y-rec.top;
		console.log("HIGHT: ", ht)

		if (ht > 300) {
			container.style.height = ht + 'px';
		}
	}
}