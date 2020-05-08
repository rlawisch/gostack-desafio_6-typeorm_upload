import { getCustomRepository, getRepository } from 'typeorm';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
}

class GetCategoryIdService {
  public async execute({
    title
  }: Request): Promise<Transaction> {
    const categoryRepository = getRepository(Category);

    const foundCategory = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    let category_id =
    if (!foundCategory) {
      const createdCategory = await categoryRepository.create({
        title: categoryTitle,
      });
      categoryRepository.save(createdCategory);
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionsRepository.create({
      title,
      type,
      value,
      category_id: (foundCategory || createdCategory).id,
    });
    return transaction;
  }
}

export default CreateTransactionService;
