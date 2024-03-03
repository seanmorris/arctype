import { View } from 'curvature/base/View';

const root = View.from(`
	<div class = "page-wrapper">
		<h1>ArcType Demo</h1>
		<p>Quicker typing for gamepads.</p>
		<section class = "form">
			<label>Test input: <input /></label>
		</section>
		<section class = "footer">&copy; 2021 - 2024 Sean Morris</section>
	</div>
`);

document.addEventListener('DOMContentLoaded', () => root.render(document.body));

import { ArcType } from './ArcType';

const arc  = new ArcType;

// Render arctype to the document body when the DOM is ready
document.addEventListener('DOMContentLoaded', () => arc.render(document.body));

// Trigger ArcType on element focus
document.addEventListener('focus', event => {

	// Ignore everything except typeable inputs and textareas
	if(!event.target.matches('input[type="text"],textarea,input:not([type])'))
	{
		return;
	}

	// Actvate arctype for the focused element
	arc.activate(event.target);

}, {capture: true});
