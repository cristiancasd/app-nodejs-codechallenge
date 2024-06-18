import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert
} from 'typeorm';

import { v4 as uuidv4 } from 'uuid';
import { TransactionStatesConstant } from '../../../core';

@Entity('transactions')
export class TransactionModel {
  @PrimaryGeneratedColumn('uuid')
  transactionExternalId!: string;

  @Column({
    type: 'enum',
    enum: TransactionStatesConstant,
    default: TransactionStatesConstant.pending
  })
  transactionStatus!: TransactionStatesConstant;

  @Column()
  accountExternalIdDebit!: string;

  @Column()
  accountExternalIdCredit!: string;

  @Column()
  tranferTypeId!: number;

  @Column()
  value!: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedOn?: Date;

  @BeforeInsert()
  async generateUUID() {
    this.transactionExternalId = uuidv4();
  }
}
