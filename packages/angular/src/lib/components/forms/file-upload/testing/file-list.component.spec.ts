import { TestBed } from '@angular/core/testing';
import { Component, provideZonelessChangeDetection } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

import { SolarisFileListComponent } from '../component/file-list.component';
import { SolarisFileListItemComponent } from '../component/file-list-item.component';
import { SolarisIconComponent } from '../../../icon/component/solaris-icon.component';
import { createUploadItem } from '../model/upload-state';

import { provideSolarisTesting } from '../../../../testing/provide-solaris-testing';

function makeFile(
  name = 'doc.pdf',
  size = 2048,
  type = 'application/pdf',
): File {
  return new File([new Uint8Array(Math.max(1, size))], name, { type });
}

@Component({
  standalone: true,
  imports: [SolarisFileListComponent, ReactiveFormsModule],
  template: `<solaris-file-list [items]="items"></solaris-file-list>`,
})
class ListHost {
  items = [createUploadItem(makeFile())];
}

@Component({
  standalone: true,
  imports: [SolarisFileListComponent, ReactiveFormsModule],
  template: `<solaris-file-list
    [items]="items"
    label="My files"
  ></solaris-file-list>`,
})
class LabelledListHost {
  items = [createUploadItem(makeFile())];
}

@Component({
  standalone: true,
  imports: [SolarisFileListItemComponent, ReactiveFormsModule],
  template: `<solaris-file-list-item [item]="item"></solaris-file-list-item>`,
})
class ItemHost {
  item = createUploadItem(makeFile('report.pdf', 3072, 'application/pdf'));
}

@Component({
  standalone: true,
  imports: [SolarisFileListItemComponent, ReactiveFormsModule],
  template: `<solaris-file-list-item
    [item]="item"
    [maxSize]="1024"
  ></solaris-file-list-item>`,
})
class OversizedItemHost {
  item = {
    ...createUploadItem(makeFile('big.bin', 2048)),
    status: 'error' as const,
    error: 'max-size' as const,
  };
}

@Component({
  standalone: true,
  imports: [SolarisFileListItemComponent, ReactiveFormsModule],
  template: `<solaris-file-list-item [item]="item"></solaris-file-list-item>`,
})
class UploadingItemHost {
  item = {
    ...createUploadItem(makeFile('video.mp4', 4096, 'video/mp4')),
    status: 'uploading' as const,
    progress: 40,
  };
}

@Component({
  standalone: true,
  imports: [SolarisFileListItemComponent, ReactiveFormsModule],
  template: `<solaris-file-list-item [item]="item"></solaris-file-list-item>`,
})
class FailedItemHost {
  item = {
    ...createUploadItem(makeFile('doc.pdf')),
    status: 'error' as const,
    error: 'upload-failed' as const,
  };
}

describe('SolarisFileListComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('renders one row per item with list semantics', () => {
    const fixture = TestBed.createComponent(ListHost);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('solaris-file-list'));
    expect(list.nativeElement.getAttribute('role')).toBe('list');
    expect(list.nativeElement.getAttribute('aria-label')).toBe(
      'Selected files',
    );
    const rows = fixture.debugElement.queryAll(
      By.css('solaris-file-list-item'),
    );
    expect(rows).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('doc.pdf');
  });

  it('honours a custom list label', () => {
    const fixture = TestBed.createComponent(LabelledListHost);
    fixture.detectChanges();
    const list = fixture.debugElement.query(By.css('solaris-file-list'));
    expect(list.nativeElement.getAttribute('aria-label')).toBe('My files');
  });

  it('forwards removed and retried events', () => {
    const fixture = TestBed.createComponent(ListHost);
    fixture.detectChanges();
    const list = fixture.debugElement.query(
      By.directive(SolarisFileListComponent),
    ).componentInstance as SolarisFileListComponent;
    const removed: string[] = [];
    const retried: string[] = [];
    list.removed.subscribe((id) => removed.push(id));
    list.retried.subscribe((id) => retried.push(id));
    const row = fixture.debugElement.query(
      By.directive(SolarisFileListItemComponent),
    ).componentInstance as SolarisFileListItemComponent;
    row.removed.emit('item-1');
    row.retried.emit('item-1');
    expect(removed).toEqual(['item-1']);
    expect(retried).toEqual(['item-1']);
  });
});

describe('SolarisFileListItemComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideSolarisTesting()],
    }).compileComponents();
  });

  it('shows name, size, and translated status', () => {
    const fixture = TestBed.createComponent(ItemHost);
    fixture.detectChanges();
    const item = fixture.debugElement.query(By.css('solaris-file-list-item'));
    expect(item.nativeElement.getAttribute('data-status')).toBe('ready');
    expect(item.nativeElement.getAttribute('role')).toBe('listitem');
    expect(fixture.nativeElement.textContent).toContain('report.pdf');
    expect(fixture.nativeElement.textContent).toContain('3 KB');
    expect(fixture.nativeElement.textContent).toContain('Ready to upload');
  });

  it('labels the remove button with the file name', () => {
    const fixture = TestBed.createComponent(ItemHost);
    fixture.detectChanges();
    const remove = fixture.debugElement.query(
      By.css('.solaris-file-list-item__action'),
    );
    expect(remove.nativeElement.getAttribute('aria-label')).toBe(
      'Remove report.pdf',
    );
  });

  it('emits removed with the item id', () => {
    const fixture = TestBed.createComponent(ItemHost);
    fixture.detectChanges();
    const row = fixture.debugElement.query(
      By.directive(SolarisFileListItemComponent),
    ).componentInstance as SolarisFileListItemComponent;
    const emitted: string[] = [];
    row.removed.subscribe((id) => emitted.push(id));
    fixture.debugElement
      .query(By.css('.solaris-file-list-item__action'))
      .nativeElement.click();
    const expected = (fixture.componentInstance as ItemHost).item.id;
    expect(emitted).toEqual([expected]);
  });

  it('shows progress with aria values while uploading', () => {
    const fixture = TestBed.createComponent(UploadingItemHost);
    fixture.detectChanges();
    const progress = fixture.debugElement.query(By.css('solaris-progress'));
    expect(progress).toBeTruthy();
    expect(progress.nativeElement.getAttribute('aria-valuenow')).toBe('40');
    expect(fixture.nativeElement.textContent).toContain('Uploading');
  });

  it('explains max-size errors with the configured limit', () => {
    const fixture = TestBed.createComponent(OversizedItemHost);
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain(
      'File exceeds the maximum size of 1 KB.',
    );
    const actions = fixture.debugElement.queryAll(
      By.css('.solaris-file-list-item__action'),
    );
    expect(actions).toHaveLength(1);
  });

  it('offers retry for failed uploads', () => {
    const fixture = TestBed.createComponent(FailedItemHost);
    fixture.detectChanges();
    const actions = fixture.debugElement.queryAll(
      By.css('.solaris-file-list-item__action'),
    );
    expect(actions).toHaveLength(2);
    expect(actions[0].nativeElement.getAttribute('aria-label')).toBe(
      'Retry upload of doc.pdf',
    );
    expect(fixture.nativeElement.textContent).toContain(
      'Could not upload doc.pdf.',
    );
    const row = fixture.debugElement.query(
      By.directive(SolarisFileListItemComponent),
    ).componentInstance as SolarisFileListItemComponent;
    const emitted: string[] = [];
    row.retried.subscribe((id) => emitted.push(id));
    actions[0].nativeElement.click();
    const expected = (fixture.componentInstance as FailedItemHost).item.id;
    expect(emitted).toEqual([expected]);
  });

  it('supports keyboard activation through native buttons', () => {
    const fixture = TestBed.createComponent(FailedItemHost);
    fixture.detectChanges();
    const actions = fixture.debugElement.queryAll(
      By.css('.solaris-file-list-item__action'),
    );
    for (const action of actions) {
      expect(action.nativeElement.tagName).toBe('BUTTON');
      expect(action.nativeElement.getAttribute('type')).toBe('button');
    }
  });

  it.each([
    ['photo.png', 'image/png', 'image'],
    ['clip.mp4', 'video/mp4', 'video'],
    ['note.mp3', 'audio/mpeg', 'mic'],
    ['doc.pdf', 'application/pdf', 'file-text'],
    ['notes.txt', 'text/plain', 'file-text'],
  ])('shows the %s icon for %s', (name, type, expected) => {
    @Component({
      standalone: true,
      imports: [SolarisFileListItemComponent, ReactiveFormsModule],
      template: `<solaris-file-list-item
        [item]="item"
      ></solaris-file-list-item>`,
    })
    class TypedItemHost {
      item = createUploadItem(new File(['x'], name, { type }));
    }
    const fixture = TestBed.createComponent(TypedItemHost);
    fixture.detectChanges();
    const icon = fixture.debugElement.query(By.directive(SolarisIconComponent))
      .componentInstance as SolarisIconComponent;
    expect(icon.name()).toBe(expected);
  });
});
