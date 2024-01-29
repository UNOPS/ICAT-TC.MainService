export const jwtConstants = {
  secret:  '7AnEd5epXmdaJfUrokkQ' ,
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
