import { TestBed, type ComponentFixture } from '@angular/core/testing';

import { Solaris<%= pascalName %>Component } from '../component/<%= name %>.component';

describe('Solaris<%= pascalName %>Component', () => {
  let fixture: ComponentFixture<Solaris<%= pascalName %>Component>;

  function create(): HTMLElement {
    TestBed.configureTestingModule({});
    fixture = TestBed.createComponent(Solaris<%= pascalName %>Component);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('creates the component', () => {
    expect(create()).toBeTruthy();
  });

  it('uses md as the default size', () => {
    expect(create().getAttribute('data-size')).toBe('md');
  });
});
