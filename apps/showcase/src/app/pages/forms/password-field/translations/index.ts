import { passwordFieldEnUs } from './en-US';
import { passwordFieldPtBr } from './pt-BR';

export const PASSWORD_FIELD_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  'en-US': passwordFieldEnUs,
  'pt-BR': passwordFieldPtBr,
};
