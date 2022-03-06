import { View } from 'curvature/base/View';

const root = View.from(`
	<h1>ArcType Demo</h1>
	<p>Quicker typing for gamepads.</p>
	<section class = "form">
		<label>Test input: <input /></label>
	</section>
	<section class = "footer">&copy; 2021 - 2022 Sean Morris</section>
`);

document.addEventListener('DOMContentLoaded', () => root.render(document.body));

import { ArcType } from './ArcType';

const arc  = new ArcType;

document.addEventListener('focus', event => {
	if(!event.target.matches('input[type="text"],textarea,input:not([type])'))
	{
		return;
	}

	arc.activate(event.target);
}, {capture: true});


document.addEventListener('DOMContentLoaded', () => arc.render(document.body));
