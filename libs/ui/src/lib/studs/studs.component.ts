import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lego-ui-studs',
  imports: [CommonModule],
  template: `
        <ul aria-hidden="true" role="presentation">
          @for (i of [].constructor(4); track i) {
            <li role="presentation"></li>
          }
        </ul>
        `,
  styles: `
    ul {
      list-style: none;
      padding-inline-start: 0;
      margin-block-start: clamp(6px, 1vw, 10px);
      margin-block-end: 0;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: repeat(2, 1fr);
      gap: clamp(4px, 0.5vw, 12px);
      width: 100%;
      height: 100%;
      margin-bottom: 5px;
    }

    li {
      margin-left: clamp(2px, 0.5vw, 8px);
      width: clamp(24px, 4vw, 40px);
      height: clamp(28px, 5vw, 44px);
      border-radius: 50% / 30%;
      background-color: #1565c0;
      position: relative;
      box-shadow:
        inset 0 -10px 15px rgba(0, 0, 0, 0.3),
        0 10px 10px rgba(0, 0, 0, 0.4);
      z-index: 1;
      transform: rotateX(15deg) translateY(-0.1em);
    }

    li::before {
      content: '';
      position: absolute;
      top: 10%;
      left: 10%;
      right: 10%;
      height: 30%;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      pointer-events: none;
    }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudsComponent {

}
