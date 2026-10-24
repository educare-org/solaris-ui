import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { SolarisColumnManagerComponent } from '../component/column-manager/column-manager.component';
import type { SolarisTableFilterableColumn } from '../model/filter.types';

interface Row {
  id: string;
  name: string;
}

const COLUMNS: readonly SolarisTableFilterableColumn<Row>[] = [
  { id: 'name', header: 'Name', accessor: 'name' },
  { id: 'city', header: 'City', accessor: 'id' },
  { id: 'age', header: 'Age', accessor: 'id' },
];

function createFixture(): ComponentFixture<SolarisColumnManagerComponent<Row>> {
  TestBed.configureTestingModule({});
  const fixture = TestBed.createComponent(SolarisColumnManagerComponent<Row>);
  fixture.componentRef.setInput('columns', COLUMNS);
  fixture.componentRef.setInput('order', ['age', 'name', 'city']);
  fixture.componentRef.setInput('visibility', { city: false });
  fixture.detectChanges();
  return fixture;
}

describe('SolarisColumnManagerComponent', () => {
  it('should render columns in the given order', () => {
    const fixture = createFixture();
    const labels = Array.from(
      fixture.nativeElement.querySelectorAll('.solaris-column-manager__label'),
    ).map((entry) => (entry as HTMLElement).textContent?.trim());
    expect(labels).toEqual(['Age', 'Name', 'City']);
  });

  it('should reflect visibility in checkboxes', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      isVisible: (columnId: string) => boolean;
    };
    expect(component.isVisible('city')).toBe(false);
    expect(component.isVisible('name')).toBe(true);
  });

  it('should toggle visibility without emitting until save', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      toggleVisibility: (columnId: string, visible: boolean) => void;
      isVisible: (columnId: string) => boolean;
      handleSave: () => void;
    };
    const emitted: unknown[] = [];
    fixture.componentInstance.save.subscribe((value) => emitted.push(value));
    component.toggleVisibility('city', true);
    expect(component.isVisible('city')).toBe(true);
    expect(emitted.length).toBe(0);
    component.handleSave();
    expect(emitted.length).toBe(1);
  });

  it('should move columns with keyboard actions', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      moveUp: (columnId: string) => void;
      moveDown: (columnId: string) => void;
      draftOrder: () => readonly string[];
    };
    component.moveUp('name');
    expect(component.draftOrder()).toEqual(['name', 'age', 'city']);
    component.moveDown('name');
    expect(component.draftOrder()).toEqual(['age', 'name', 'city']);
  });

  it('should reorder on drop', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      onDragStart: (columnId: string, event: DragEvent) => void;
      onDrop: (columnId: string, event: DragEvent) => void;
      draftOrder: () => readonly string[];
    };
    const dragStart = {
      dataTransfer: { effectAllowed: '', setData: () => undefined },
    } as unknown as DragEvent;
    const drop = { preventDefault: () => undefined } as unknown as DragEvent;
    component.onDragStart('city', dragStart);
    component.onDrop('age', drop);
    expect(component.draftOrder()).toEqual(['city', 'age', 'name']);
  });

  it('should emit reset and cancel', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      handleReset: () => void;
      handleCancel: () => void;
    };
    let reset = 0;
    let cancelled = 0;
    fixture.componentInstance.resetRequest.subscribe(() => (reset += 1));
    fixture.componentInstance.cancelled.subscribe(() => (cancelled += 1));
    component.handleReset();
    component.handleCancel();
    expect(reset).toBe(1);
    expect(cancelled).toBe(1);
  });

  it('should restore default order and visibility on reset', () => {
    const fixture = createFixture();
    const component = fixture.componentInstance as unknown as {
      handleReset: () => void;
      handleSave: () => void;
      isVisible: (columnId: string) => boolean;
      draftOrder: () => readonly string[];
    };
    const emitted: { order: readonly string[]; visibility: object }[] = [];
    fixture.componentInstance.save.subscribe((value) =>
      emitted.push({
        order: value.order,
        visibility: value.visibility,
      }),
    );
    component.handleReset();
    expect(component.draftOrder()).toEqual(['name', 'city', 'age']);
    expect(component.isVisible('city')).toBe(true);
    component.handleSave();
    expect(emitted).toEqual([
      { order: ['name', 'city', 'age'], visibility: {} },
    ]);
  });

  it('should disable save while drafts match the applied state', () => {
    const fixture = createFixture();
    const saveButton = fixture.nativeElement.querySelector(
      '.solaris-column-manager__footer button:last-child',
    ) as HTMLButtonElement;
    expect(saveButton.hasAttribute('disabled')).toBe(true);
    const component = fixture.componentInstance as unknown as {
      toggleVisibility: (columnId: string, visible: boolean) => void;
      handleReset: () => void;
    };
    component.toggleVisibility('city', true);
    fixture.detectChanges();
    expect(saveButton.hasAttribute('disabled')).toBe(false);
    component.toggleVisibility('city', false);
    fixture.detectChanges();
    expect(saveButton.hasAttribute('disabled')).toBe(true);
  });

  it('should enable save after reset when defaults differ from applied', () => {
    const fixture = createFixture();
    const saveButton = fixture.nativeElement.querySelector(
      '.solaris-column-manager__footer button:last-child',
    ) as HTMLButtonElement;
    expect(saveButton.hasAttribute('disabled')).toBe(true);
    const component = fixture.componentInstance as unknown as {
      handleReset: () => void;
    };
    component.handleReset();
    fixture.detectChanges();
    expect(saveButton.hasAttribute('disabled')).toBe(false);
  });

  it('should disable reset while drafts match the defaults', () => {
    TestBed.configureTestingModule({});
    const fixture = TestBed.createComponent(SolarisColumnManagerComponent<Row>);
    fixture.componentRef.setInput('columns', COLUMNS);
    fixture.detectChanges();
    const resetButton = fixture.nativeElement.querySelector(
      '.solaris-column-manager__header button',
    ) as HTMLButtonElement;
    expect(resetButton.hasAttribute('disabled')).toBe(true);
    const component = fixture.componentInstance as unknown as {
      moveDown: (columnId: string) => void;
    };
    component.moveDown('name');
    fixture.detectChanges();
    expect(resetButton.hasAttribute('disabled')).toBe(false);
  });
});
