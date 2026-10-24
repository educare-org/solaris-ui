import { Component, computed, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  buildGradebookColumns,
  type SolarisGradebookAggregate,
  type SolarisGradebookColumn,
  type SolarisGradebookRounding,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_IDENTITY,
  GRADEBOOK_SHOWCASE_ROWS,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

type AggregateMode = Exclude<SolarisGradebookAggregate, 'weighted' | 'none'>;

const ROUNDINGS: Record<string, SolarisGradebookRounding> = {
  standard: {},
  up: { maximumFractionDigits: 1, mode: 'up' },
  down: { maximumFractionDigits: 1, mode: 'down' },
};

@Component({
  standalone: true,
  selector: 'app-totals-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './totals.component.html',
  styleUrls: ['./totals.component.scss'],
})
export class TotalsGradebookExample {
  protected readonly rows = GRADEBOOK_SHOWCASE_ROWS;
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;

  protected readonly aggregate = signal<AggregateMode>('average');
  protected readonly roundingKey = signal<string>('standard');
  protected readonly withMax = signal<boolean>(false);

  protected readonly rounding = computed<SolarisGradebookRounding>(
    () => ROUNDINGS[this.roundingKey()] ?? {},
  );

  protected readonly columns = computed(
    (): readonly SolarisGradebookColumn<ShowcaseSubject>[] => {
      const aggregate = this.aggregate();
      const inputs = buildGradebookColumns<ShowcaseSubject>(
        [
          { id: 'gs1', title: 'GS1', maxScore: 20 },
          { id: 'gs2', title: 'GS2', maxScore: 20 },
        ],
        { withMaxColumns: this.withMax() },
      ).map(
        (column): SolarisGradebookColumn<ShowcaseSubject> => ({
          ...column,
          aggregate,
        }),
      );
      return [
        ...inputs,
        {
          id: 'mp',
          header: 'MP',
          type: 'number',
          align: 'end',
          sortable: true,
          assignmentId: 'mp',
          maxScore: 20,
          aggregate,
          computed: { from: ['gs1', 'gs2'], by: 'average' },
        } satisfies SolarisGradebookColumn<ShowcaseSubject>,
      ];
    },
  );

  protected toggleMax(event: Event): void {
    this.withMax.set((event.target as HTMLInputElement).checked);
  }
}
