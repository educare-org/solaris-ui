import { Component } from '@angular/core';

import { ShowcaseShell } from './shell/shell/shell';

@Component({
  selector: 'app-root',
  imports: [ShowcaseShell],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {}
