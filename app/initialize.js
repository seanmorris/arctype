import { View } from 'curvature/base/View';
import { ArcType } from 'ArcType';

const root = View.from(`
  <h1>ArcType</h1>
  <p>Quicker typing for gamepads.</p>
  <section class = "form">
    <label>Test input: <input cv-on = "focus" /></label>
  </section>
  [[arc]]
  <section class = "footer">&copy; 2021 - 2022 Sean Morris</section>
`);
const arc  = new ArcType;

root.focus = event => arc.activate(event.target);

root.args.arc = arc;

document.addEventListener('DOMContentLoaded', function() {
  root.render(document.body);
});
