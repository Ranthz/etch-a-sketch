const rows = document.querySelector('#rows');
const columns = document.querySelector('#columns');
const toggleEl = document.querySelectorAll('.toggle');

let mouseDown = false;

let paintMode = document.querySelector('.favcolor').value;

toggleEl.forEach((button) => {
	button.addEventListener('click', () => {
		document.querySelector('.active')?.classList.remove('active');
		button.classList.add('active');
	});
});

function randomColor() {
	return `#${Math.floor(Math.random() * 2 ** 24)
		.toString(16)
		.padStart(6, 0)}`;
}

function RGBToHSL(rgb, e) {
	let sep = rgb.indexOf(',') > -1 ? ',' : ' ';
	rgb = rgb.substr(4).split(')')[0].split(sep);
	for (let R in rgb) {
		let r = rgb[R];
		if (r.indexOf('%') > -1)
			rgb[R] = Math.round((r.substr(0, r.length - 1) / 100) * 255);
	}
	let r = rgb[0] / 255,
		g = rgb[1] / 255,
		b = rgb[2] / 255;
	let cmin = Math.min(r, g, b),
		cmax = Math.max(r, g, b),
		delta = cmax - cmin,
		h = 0,
		s = 0,
		l = 0;
	if (delta == 0) h = 0;
	else if (cmax == r) h = ((g - b) / delta) % 6;
	else if (cmax == g) h = (b - r) / delta + 2;
	else h = (r - g) / delta + 4;
	h = Math.round(h * 60);
	if (h < 0) h += 360;
	l = (cmax + cmin) / 2;
	s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
	s = +(s * 100).toFixed(1);
	l = +(l * 100).toFixed(1);
	return 'hsl(' + h + ',' + s + '%,' + `${l + e}` + '%)';
}

rows.addEventListener('change', (event) => {
	if (rows.value < 5) {
		createGrid(5, columns.value);
		rows.value = 5;
	} else if (rows.value > 70) {
		createGrid(70, columns.value);
		rows.value = 70;
	} else {
		createGrid(rows.value, columns.value);
	}
});

columns.addEventListener('change', (event) => {
	if (columns.value < 5) {
		createGrid(rows.value, 5);
		columns.value = 5;
	} else if (columns.value > 70) {
		createGrid(rows.value, 70);
		columns.value = 70;
	} else {
		createGrid(rows.value, columns.value);
	}
});

// function active(e) {
// 	if (e.target.className == 'toggle') {
// 		const toggle = document.querySelectorAll('.toggle');
// 		let btn = e.target.closest('button');
// 		toggle.forEach((e) => {
// 			e.classList.remove('active');
// 		});
// 		e.target.classList.toggle('active');
// 	}
// }

document.querySelector('.favcolor').addEventListener('change', (event) => {
	paintMode = event.target.value;
});
document.querySelector('.favcolor').addEventListener('click', (event) => {
	paintMode = event.target.value;
});
document.querySelector('#rainbow').addEventListener('click', (event) => {
	paintMode = 'rainbow';
});
document.querySelector('#burn').addEventListener('click', (event) => {
	paintMode = 'burn';
});
document.querySelector('#dodge').addEventListener('click', (event) => {
	paintMode = 'dodge';
});
document.querySelector('#erase').addEventListener('click', (event) => {
	paint('erase');
});
document.querySelector('#grid').addEventListener('click', (event) => {
	document.querySelectorAll('.cell').forEach((e) => e.classList.toggle('brdr'));
});

document.addEventListener('mousedown', (event) => {
	if (event.button == 0) {
		if (
			event.target.className === 'cell' ||
			event.target.className === 'cell brdr'
		) {
			mouseDown = true;
			paint(paintMode);
		}
	}
});
document.addEventListener('mouseover', (event) => {
	if (
		event.target.className === 'cell' ||
		event.target.className === 'cell brdr'
	) {
		if (mouseDown) {
			paint(paintMode);
		}
	}
});
document.addEventListener('mouseup', () => {
	mouseDown = false;
});

function paint(mode) {
	switch (mode) {
		case 'rainbow':
			event.target.style.backgroundColor = randomColor();
			break;
		case 'erase':
			const cells = document.querySelectorAll('.cell');
			cells.forEach((cell) => (cell.style.backgroundColor = ''));
			break;
		case 'burn':
			event.target.style.backgroundColor = RGBToHSL(
				event.target.style.backgroundColor,
				-10
			);
			break;
		case 'dodge':
			event.target.style.backgroundColor = RGBToHSL(
				event.target.style.backgroundColor,
				+10
			);
			break;
		default:
			event.target.style.backgroundColor = paintMode;
			break;
	}
}

function createGrid(row, column) {
	const totalColumns = document.querySelectorAll('.rowWrap');
	const cellsContainer = document.querySelector('.cells-container');

	for (let i = totalColumns.length; i < column; i++) {
		const rowWrap = document.createElement('div');
		rowWrap.setAttribute('class', 'rowWrap');
		cellsContainer.appendChild(rowWrap);
	}
	for (let i = totalColumns.length; i > column; i--) {
		cellsContainer.removeChild(cellsContainer.lastChild);
	}
	document.querySelectorAll('.rowWrap').forEach((e) => {
		for (let i = e.childElementCount; i < row; i++) {
			const cell = document.createElement('div');
			cell.setAttribute('class', 'cell brdr');
			//disables dragging that caused some unwanted bugs
			cell.setAttribute('ondragstart', 'return false');
			e.appendChild(cell);
		}
	});
	document.querySelectorAll('.rowWrap').forEach((e) => {
		for (let i = e.childElementCount; i > row; i--) {
			e.removeChild(e.lastChild);
		}
	});
	cellSize(row, column);
}

function cellSize(row, column) {
	const height = document.querySelector('.cells-container').offsetHeight;
	const width = document.querySelector('.cells-container').offsetWidth;
	const cells = document.querySelectorAll('.cell');
	let size;
	if (+row > +column) {
		size = width / row;
		cells.forEach((cell) => (cell.style.width = `${size}px`));
		cells.forEach((cell) => (cell.style.height = `${size}px`));
	} else {
		size = height / column;
		cells.forEach((cell) => (cell.style.height = `${size}px`));
		cells.forEach((cell) => (cell.style.width = `${size}px`));
	}
}

createGrid(16, 16);
