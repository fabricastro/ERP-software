import { Base } from "./base";

export interface Customer extends Base {
  type: string;
  name: string;
  cuit: string;
  fiscalAddress: string;
  postalCode: string;
  community: string;
  province: string;
  country: string;
  phone: string;
  email: string;
  web: string;
}
