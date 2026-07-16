import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  SolarisCheckboxGroupComponent,
  SolarisCheckboxComponent,
  SolarisFormFieldComponent,
  SolarisTranslatePipe,
} from '@solaris-ui/angular';

interface Module {
  id: number;
  name: string;
}

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SolarisCheckboxGroupComponent,
    SolarisCheckboxComponent,
    SolarisFormFieldComponent,
    SolarisTranslatePipe,
  ],
  templateUrl: './checkbox-group-showcase.html',
  styleUrls: ['./checkbox-group-showcase.scss'],
})
export class CheckboxGroupShowcasePage {
  protected readonly basicControl = new FormControl<string[]>([]);
  protected readonly horizontalControl = new FormControl<string[]>([]);
  protected readonly gridControl = new FormControl<string[]>([]);
  protected readonly selectAllControl = new FormControl<string[]>([]);
  protected readonly minSelectedControl = new FormControl<string[]>([]);
  protected readonly maxSelectedControl = new FormControl<string[]>([]);
  protected readonly disabledControl = new FormControl<string[]>([
    'sports',
    'finance',
  ]);
  protected readonly readonlyControl = new FormControl<string[]>([
    'sports',
    'technology',
  ]);
  protected readonly standaloneControl = new FormControl<string[]>([]);
  protected readonly formFieldControl = new FormControl<string[]>(
    ['sports', 'finance'],
    Validators.required,
  );

  protected readonly complexForm = new FormGroup({
    modules: new FormControl<Module[]>([{ id: 1, name: 'Academic' }]),
  });

  protected readonly module1: Module = { id: 1, name: 'Academic' };
  protected readonly module2: Module = { id: 2, name: 'Finance' };
  protected readonly module3: Module = { id: 3, name: 'Reports' };

  protected get basicValue(): string[] {
    return this.basicControl.value ?? [];
  }

  protected get minSelectedValue(): string[] {
    return this.minSelectedControl.value ?? [];
  }

  protected get maxSelectedValue(): string[] {
    return this.maxSelectedControl.value ?? [];
  }

  protected compareModule(a: unknown, b: unknown): boolean {
    return (a as Module).id === (b as Module).id;
  }
}
