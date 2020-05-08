import csvParse from 'csv-parse';
import fs from 'fs';
import path from 'path';

import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  filename: string;
}

class ImportTransactionsService {
  async execute({ filename }: Request): Promise<Transaction[]> {
    const csvFilePath = path.join(uploadConfig.directory, filename);
    const csvFileExists = await fs.promises.stat(csvFilePath);

    if (!csvFileExists) {
      throw new AppError('Error on file uploading');
    }

    const readCSVStream = fs.createReadStream(csvFilePath);

    const parseStream = csvParse({
      columns: true,
      ltrim: true,
      rtrim: true,
    });

    const csvParser = readCSVStream.pipe(parseStream);

    const transactions: Transaction[] = [];
    const createTransactionService = new CreateTransactionService();

    for await (const record of csvParser) {
      const transaction = await createTransactionService.execute(record);
      transactions.push(transaction);
    }

    return transactions;
  }
}

export default ImportTransactionsService;
