import { Base } from "./base";
import { Category } from "./category";
import { Provider } from "./provider";

export interface Article extends Base {
  type: string;
  category?: Category;
  categoryId: number;
  name: string;
  status: string;
  description: string;
  sku: string;
  barcode: string;
  internalCost: number;
  profitability: number;
  unitPrice: number;
  iva: number;
  providerId: number;
  provider?: Provider;
  observations?: string;
  stock: number;
  discount?: number;
  subtotal?: number;
  }