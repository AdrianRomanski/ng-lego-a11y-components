import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lego-components-landmarks',
  imports: [CommonModule],
  templateUrl: './landmarks.component.html',
  styleUrl: './landmarks.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LandmarksComponent {}
