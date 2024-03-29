import { View } from 'curvature/base/View';
import { ArcType } from './ArcType';

const root = View.from(`
	<div class = "page-wrapper">
		<h1>ArcType Demo</h1>
		<p>
			Quicker typing for gamepads.
			<a cv-link = "https://github.com/seanmorris/arctype">GitHub</a> / <a cv-link = "https://npmjs.com/package/@seanmorris/arctype">NPM</a>.
		</p>
		<section class = "form">
			<label>Test input: <input /></label>
		</section>
		<section class = "footer">&copy; 2021 - 2024 Sean Morris</section>
	</div>
`);

document.addEventListener('DOMContentLoaded', () => root.render(document.body));

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
