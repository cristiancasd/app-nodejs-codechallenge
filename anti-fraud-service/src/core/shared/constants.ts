export enum TransactionTopicsConstant {
  TransactionCreated = 'transactionCreated',
  TransactionEdited = 'transactionEdited',
  TransactionProcessed = 'processedTransactions'
}

export enum TransactionStatesConstant {
  pending = 'pendig',
  approved = 'approved',
  rejected = 'rejected'
}

export enum TransactionTypesNamesConstant {
  TransferenciaEntreCuentasPropias = 'Transferencia Entre Cuentas Propias',
  TransferenciaATercerosMismoBanco = 'Transferencia A Terceros MismoBanco',
  TransferenciaOtrosBancosNacionales = 'Transferencia Otros Bancos Nacionales',
  TransferenciaInternacional = 'Transferencia Internacional',
  PagosProgramados = 'Pagos Programados',
  TransferenciaUrgente = 'Transferencia Urgente',
  TransferenciaBeneficios = 'Transferencia Beneficios',
  TransferenciaInversiones = 'Transferencia Inversiones'
}
