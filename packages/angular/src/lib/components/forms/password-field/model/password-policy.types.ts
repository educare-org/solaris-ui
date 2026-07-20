export interface SolarisPasswordPolicy {
  minLength?: number;
  maxLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSymbol?: boolean;
  disallowWhitespace?: boolean;
  forbiddenValues?: string[];
}
