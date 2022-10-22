// These are really prisma errors and this file needs renaming
export enum PostgresErrorCode {
  UniqueViolation = 'P2002',
  RecordDependencyFailed = 'P2025',
}
