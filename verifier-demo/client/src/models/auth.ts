export type PassportCredential = {
  id?: string;
  type?: "PassportCredential";
  birthDate?: Date;
  givenName?: string;
  address?: string;
  dateIssued?: Date;
  familyName?: string;
  expiresOn?: Date;
  gender?: string;
};
