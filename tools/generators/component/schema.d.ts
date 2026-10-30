export interface ComponentGeneratorSchema {
  name: string;
  category:
    | 'actions'
    | 'forms'
    | 'feedback'
    | 'overlay'
    | 'navigation'
    | 'data-display'
    | 'interaction'
    | 'icon'
    | 'scheduling';
  type: 'component' | 'directive';
}
