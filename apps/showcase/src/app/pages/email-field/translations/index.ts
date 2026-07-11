import { emailFieldEnUs } from './en-US';
import { emailFieldPtBr } from './pt-BR';

export const EMAIL_FIELD_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  'en-US': emailFieldEnUs,
  'pt-BR': emailFieldPtBr,
};
