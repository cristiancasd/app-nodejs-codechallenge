export enum TransactionStatesConstant {
  pending = 'pendig',
  approved = 'approved',
  rejected = 'rejected'
}

export enum TransactionTypesConstant {
  TransferenciaEntreCuentasPropias = 1,
  TransferenciaATercerosMismoBanco = 2,
  TransferenciaOtrosBancosNacionales = 3,
  TransferenciaInternacional = 4,
  PagosProgramados = 5,
  TransferenciaUrgente = 6,
  TransferenciaBeneficios = 7,
  TransferenciaInversiones = 8
}

export enum TransactionTypesNamesConstant {
  TransferenciaEntreCuentasPropias = 'Transferencia Entre Cuentas Propias',
  TransferenciaATercerosMismoBanco = 'Transferencia A Terceros Mismo Banco',
  TransferenciaOtrosBancosNacionales = 'Transferencia Otros Bancos Nacionales',
  TransferenciaInternacional = 'Transferencia Internacional',
  PagosProgramados = 'Pagos Programados',
  TransferenciaUrgente = 'Transferencia Urgente',
  TransferenciaBeneficios = 'Transferencia Beneficios',
  TransferenciaInversiones = 'Transferencia Inversiones'
}

export function mapTransferTypeIdToTransactionTypeName(
  transferTypeId: number
): TransactionTypesNamesConstant {
  switch (transferTypeId) {
    case TransactionTypesConstant.TransferenciaEntreCuentasPropias:
      return TransactionTypesNamesConstant.TransferenciaEntreCuentasPropias;
    case TransactionTypesConstant.TransferenciaATercerosMismoBanco:
      return TransactionTypesNamesConstant.TransferenciaATercerosMismoBanco;
    case TransactionTypesConstant.TransferenciaOtrosBancosNacionales:
      return TransactionTypesNamesConstant.TransferenciaOtrosBancosNacionales;
    case TransactionTypesConstant.TransferenciaInternacional:
      return TransactionTypesNamesConstant.TransferenciaInternacional;
    case TransactionTypesConstant.PagosProgramados:
      return TransactionTypesNamesConstant.PagosProgramados;
    case TransactionTypesConstant.TransferenciaUrgente:
      return TransactionTypesNamesConstant.TransferenciaUrgente;
    case TransactionTypesConstant.TransferenciaBeneficios:
      return TransactionTypesNamesConstant.TransferenciaBeneficios;
    case TransactionTypesConstant.TransferenciaInversiones:
      return TransactionTypesNamesConstant.TransferenciaInversiones;
    default:
      return TransactionTypesNamesConstant.TransferenciaEntreCuentasPropias; // Handle any unexpected transferTypeId
  }
}

export enum TransactionTopicsConstant {
  TransactionCreated = 'transactionCreated',
  TransactionEdited = 'transactionEdited',
  TransactionProcessed = 'processedTransactions'
}

// DB code errors

export const codeError = 600;
export const codeDbError = 700;
export const codeDbErrorDuplicated = 701;

// error messages
export const duplicatedDataMessage = 'Duplicated data';
export const errorTransactionNotFound = 'Transaction not foud';
export const errorRouteNotFound = 'Route not found';
export const mustBeUidMessage = 'must be UID';
export const somethingWrongMessage = 'Something went wrong';
