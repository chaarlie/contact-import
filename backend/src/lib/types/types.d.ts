export interface CsvContact {
  birth: string;
  phone: string;
  username: string;
  creditCardNumber: string;
  creditCardNetwork?: string;
  address: string;
  email: string;
}

export interface AppUser {
  username: string;
  password: string;
}
