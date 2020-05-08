import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  transaction_id: string;
}

class DeleteTransactionService {
  public async execute({ transaction_id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const foundTransaction = await transactionsRepository.findOne(
      transaction_id,
    );

    if (!foundTransaction) {
      throw new AppError('Transaction does not exist');
    }

    await transactionsRepository.delete(transaction_id);
  }
}

export default DeleteTransactionService;
