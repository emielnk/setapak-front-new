import {Directive, ElementRef, Host, Renderer2} from '@angular/core';

/**
 * Generated class for the UserDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[m-ripple-effect]', // Attribute selector,
  host: {
    'tappable': '',
    'role': 'button',
    'style': 'position: relative; overflow: hidden'
}
})
export class RippleEffectDirective  {

    constructor(@Host() host: ElementRef, renderer: Renderer2) {
      const div = renderer.createElement('div');
        renderer.addClass(div, 'button-effect');
        renderer.setStyle(div, "display", "block");
        renderer.appendChild(host.nativeElement, div);
  }

}
