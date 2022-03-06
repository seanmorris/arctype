# ArcType

*Quicker typing for gamepads on the Web.*

ArcType is modeled after Steam's Daisywheel input method.

https://user-images.githubusercontent.com/640101/156935449-136bc56c-fa0c-4164-82e7-d3b3db2c0e93.mp4

[Live Demo](https://arctype.seanmorr.is/)

## Install

Install arctype with `npm`:

```bash
$ npm i arctype
````

## Typing

*ArcType requires a gamepad.*

* Push the left stick in the direction containing the character you want to type. When the group expands, press the coresponding face button to type the character.

* Press start to close ArcType, insert the text, and return to the page.

* Press left and right on the d-pad to move the text cursor.

* Click the left and right stick to select text.

* Left shoulder button is backspace

* Right shoulder button is space

* Left trigger switches to capitals and symbols

* Right trigger switches to numbers and symbols

## Usage

Then make your packager aware of the stylesheets located in `node_modules/arctype/arctype.css`. For example, if you're using [Brunch](https://brunch.io/) then you can add the following to your `brunch-config.js` file:

```js
exports.npm = {
	enabled: true,
	styles: {arctype: ["arctype.css"]}
}
```

Then, import the class, render an instance to the body, and call `.activate` with the element you're editing as the first and only parameter.

```javascript
import { ArcType } from 'arctype/ArcType';

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
```

&copy; 2021 - 2022 Sean Morris
