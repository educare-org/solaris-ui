import { phoneFieldEnUs } from './en-US';
import { phoneFieldPtBr } from './pt-BR';

export const PHONE_FIELD_TRANSLATIONS: Record<
  string,
  Record<string, string>
> = {
  'en-US': phoneFieldEnUs,
  'pt-BR': phoneFieldPtBr,
};
