import { Component } from '@angular/core';

import { SolarisTranslatePipe } from '@solaris-ui/angular';

import { FutureEditableNoteExample } from '../examples/future-editable-note/component/future-editable-note.component';
import { ReducedMotionNoteExample } from '../examples/reduced-motion-note/component/reduced-motion-note.component';
import { ManualActivationTabsExample } from '../examples/manual-activation/component/manual-activation.component';
import { TransitionSlideTabsExample } from '../examples/transition-slide/component/transition-slide.component';
import { IconsAndBadgesTabsExample } from '../examples/icons-and-badges/component/icons-and-badges.component';
import { TransitionFadeTabsExample } from '../examples/transition-fade/component/transition-fade.component';
import { TabsWithPanelsExample } from '../examples/with-panels/component/with-panels.component';
import { ScrollableTabsExample } from '../examples/scrollable/component/scrollable.component';
import { FullWidthTabsExample } from '../examples/full-width/component/full-width.component';
import { DisabledTabsExample } from '../examples/disabled/component/disabled.component';
import { VerticalTabsExample } from '../examples/vertical/component/vertical.component';
import { EnclosedTabsExample } from '../examples/enclosed/component/enclosed.component';
import { PillsTabsExample } from '../examples/pills/component/pills.component';
import { DensityTabsExample } from '../examples/density/component/density.component';
import { ShapeTabsExample } from '../examples/shape/component/shape.component';
import { BasicTabsExample } from '../examples/basic/component/basic.component';

@Component({
  standalone: true,
  imports: [
    SolarisTranslatePipe,
    BasicTabsExample,
    TabsWithPanelsExample,
    IconsAndBadgesTabsExample,
    DisabledTabsExample,
    VerticalTabsExample,
    PillsTabsExample,
    DensityTabsExample,
    ShapeTabsExample,
    EnclosedTabsExample,
    FullWidthTabsExample,
    ScrollableTabsExample,
    ManualActivationTabsExample,
    TransitionFadeTabsExample,
    TransitionSlideTabsExample,
    ReducedMotionNoteExample,
    FutureEditableNoteExample,
  ],
  templateUrl: './tabs-page.component.html',
  styleUrls: ['./tabs-page.component.scss'],
})
export class TabsPageComponent {}
