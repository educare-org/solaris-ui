import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

import { ShowcaseThemeToggle } from './components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ShowcaseThemeToggle],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
