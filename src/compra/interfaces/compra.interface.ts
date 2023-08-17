export interface ICompra {
  _id: string;
  user: string;
  acao: string;
  data: Date;
  valor: number;
  qtd: number;
  valueSale: number;
  qtdSale: number;
  dateSale: Date;
  valueSum: number;
  valueNow: number;
  dateValue: Date;
  saleSum: number;
  valueAdd: number;
  percentAdd: number;
}
