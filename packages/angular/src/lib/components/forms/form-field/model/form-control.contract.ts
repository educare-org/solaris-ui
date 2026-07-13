export abstract class SolarisFormControl {
  abstract id: string;
  abstract focused: boolean;
  abstract disabled: boolean;
  abstract readonly: boolean;
  abstract invalid: boolean;
  abstract required: boolean;
  abstract describedByIds: string[];
  abstract setDescribedByIds(ids: string[]): void;
  abstract focus(): void;
}
