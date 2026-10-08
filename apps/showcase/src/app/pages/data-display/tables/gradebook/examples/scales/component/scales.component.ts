import { Component, computed, signal } from '@angular/core';

import {
  SolarisGradebookComponent,
  SolarisTabComponent,
  SolarisTabsComponent,
  SolarisTranslatePipe,
  type SolarisGradebookColumn,
  type SolarisGradebookScale,
  type SolarisGradebookScaleDef,
} from '@solaris-ui/angular';

import {
  GRADEBOOK_SHOWCASE_IDENTITY,
  type ShowcaseSubject,
} from '../../../model/gradebook-showcase.data';

interface ScaleDataset {
  readonly scale: SolarisGradebookScale;
  readonly scaleDef?: SolarisGradebookScaleDef;
  readonly columns: readonly SolarisGradebookColumn<ShowcaseSubject>[];
  readonly rows: readonly ShowcaseSubject[];
}

const SCORE_100: ScaleDataset = {
  scale: 'score-100',
  columns: [
    {
      id: 'mp',
      header: 'MP',
      assignmentId: 'mp',
      maxScore: 100,
      accessor: (row: ShowcaseSubject) => row.scores['mp'] ?? null,
    },
  ],
  rows: [
    { id: 'a', name: 'Java Advanced', scores: { mp: 87.8 }, result: '' },
    { id: 'b', name: 'Mobile Development', scores: { mp: 84.4 }, result: '' },
  ],
};

const SCORE_10: ScaleDataset = {
  scale: 'score-10',
  columns: [
    {
      id: 'ftat',
      header: 'FT + AT',
      assignmentId: 'ftat',
      maxScore: 13.5,
      accessor: (row: ShowcaseSubject) => row.scores['ftat'] ?? null,
    },
  ],
  rows: [
    { id: 'a', name: 'Java Advanced', scores: { ftat: 13.1 }, result: '' },
    { id: 'b', name: 'Mobile Development', scores: { ftat: 4.4 }, result: '' },
  ],
};

const CONCEPT: ScaleDataset = {
  scale: 'concept',
  columns: [
    {
      id: 'conc',
      header: 'Conceito',
      assignmentId: 'conc',
      maxScore: 4,
      accessor: (row: ShowcaseSubject) => row.scores['conc'] ?? null,
    },
  ],
  rows: [
    { id: 'a', name: 'Java Advanced', scores: { conc: 4 }, result: '' },
    { id: 'b', name: 'Mobile Development', scores: { conc: 2 }, result: '' },
  ],
};

const BANDED: ScaleDataset = {
  scale: 'custom',
  scaleDef: {
    id: 'score-100-banded',
    format: (value, _maxScore, locale = 'en-US') => {
      if (value === null || !Number.isFinite(value)) {
        return null;
      }
      try {
        return new Intl.NumberFormat(locale, {
          maximumFractionDigits: 1,
        }).format(value);
      } catch {
        return String(value);
      }
    },
    parse: (text) => {
      const parsed = Number(text.trim().replace(',', '.'));
      return Number.isFinite(parsed) ? parsed : null;
    },
    sortValueOf: (value) => value,
    passingScore: 60,
    bands: [
      { min: 0, label: 'F' },
      { min: 60, label: 'D' },
      { min: 70, label: 'C' },
      { min: 80, label: 'B' },
      { min: 90, label: 'A' },
    ],
  },
  columns: [
    {
      id: 'mp',
      header: 'MP',
      assignmentId: 'mp',
      maxScore: 100,
      band: true,
      accessor: (row: ShowcaseSubject) => row.scores['mp'] ?? null,
    },
  ],
  rows: [
    { id: 'a', name: 'Java Advanced', scores: { mp: 87.8 }, result: '' },
    { id: 'b', name: 'Mobile Development', scores: { mp: 59.4 }, result: '' },
  ],
};

@Component({
  standalone: true,
  selector: 'app-scales-gradebook-example',
  imports: [
    SolarisGradebookComponent,
    SolarisTabsComponent,
    SolarisTabComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './scales.component.html',
})
export class ScalesGradebookExample {
  protected readonly identity = GRADEBOOK_SHOWCASE_IDENTITY;
  protected readonly selectedScale = signal<SolarisGradebookScale>('score-100');

  private readonly datasets: Record<SolarisGradebookScale, ScaleDataset> = {
    'score-100': SCORE_100,
    'score-10': SCORE_10,
    concept: CONCEPT,
    custom: BANDED,
  };

  protected readonly dataset = computed(
    () => this.datasets[this.selectedScale()],
  );
}
