import { Component, signal } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('movieland_v2');
}
