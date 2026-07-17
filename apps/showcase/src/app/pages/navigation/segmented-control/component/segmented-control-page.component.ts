import { Component } from '@angular/core';
import { SolarisTranslatePipe } from '@solaris-ui/angular';

import { SegmentedBasicExample } from '../examples/basic/component/basic.component';
import { SegmentedWithIconsExample } from '../examples/with-icons/component/with-icons.component';
import { SegmentedWithBadgeExample } from '../examples/with-badge/component/with-badge.component';
import { SegmentedAppearancesExample } from '../examples/appearances/component/appearances.component';
import { SegmentedSizesExample } from '../examples/sizes/component/sizes.component';
import { SegmentedDensityExample } from '../examples/density/component/density.component';
import { SegmentedRadiusExample } from '../examples/radius/component/radius.component';
import { SegmentedFullWidthExample } from '../examples/full-width/component/full-width.component';
import { SegmentedEqualWidthExample } from '../examples/equal-width/component/equal-width.component';
import { SegmentedVerticalExample } from '../examples/vertical/component/vertical.component';
import { SegmentedDisabledGroupExample } from '../examples/disabled-group/component/disabled-group.component';
import { SegmentedDisabledItemExample } from '../examples/disabled-item/component/disabled-item.component';
import { SegmentedReadonlyExample } from '../examples/readonly/component/readonly.component';
import { SegmentedInvalidExample } from '../examples/invalid/component/invalid.component';
import { SegmentedReactiveFormsExample } from '../examples/reactive-forms/component/reactive-forms.component';
import { SegmentedIconOnlyExample } from '../examples/icon-only/component/icon-only.component';
import { SegmentedLongLabelsExample } from '../examples/long-labels/component/long-labels.component';
import { SegmentedNoIndicatorExample } from '../examples/no-indicator/component/no-indicator.component';

@Component({
  standalone: true,
  imports: [
    SolarisTranslatePipe,
    SegmentedBasicExample,
    SegmentedWithIconsExample,
    SegmentedWithBadgeExample,
    SegmentedAppearancesExample,
    SegmentedSizesExample,
    SegmentedDensityExample,
    SegmentedRadiusExample,
    SegmentedFullWidthExample,
    SegmentedEqualWidthExample,
    SegmentedVerticalExample,
    SegmentedDisabledGroupExample,
    SegmentedDisabledItemExample,
    SegmentedReadonlyExample,
    SegmentedInvalidExample,
    SegmentedReactiveFormsExample,
    SegmentedIconOnlyExample,
    SegmentedLongLabelsExample,
    SegmentedNoIndicatorExample,
  ],
  templateUrl: './segmented-control-page.component.html',
  styleUrls: ['./segmented-control-page.component.scss'],
})
export class SegmentedControlPageComponent {}
