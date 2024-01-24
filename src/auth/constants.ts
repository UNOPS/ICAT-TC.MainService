export const jwtConstants = {
  secret: process.env.JWT_expiresIn,
  JWT_expiresIn: process.env.JWT_expiresIn || '3600s',
};

export enum LoginRole {
  MASTER_ADMIN = "MASTER_ADMIN",
  CSI_ADMIN = "CSI_ADMIN",
  ORG_ADMIN = "ORG_ADMIN",
  ORG_USER = "ORG_USER",
  AUDITOR = "AUDITOR",
  DEO = "DEO"
}
