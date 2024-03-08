export const clock = (e: HTMLElement) => {
	const chk = (i: number) => {
		if (i < 10) {
			return '0' + i;
		}

		return String(i);
	};

	const time = new Date();
	e.innerText = chk(time.getHours()) + ':' + chk(time.getMinutes()) + ':' + chk(time.getSeconds());
};