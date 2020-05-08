import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async findByTitleOrCreate(title: string): Promise<Category> {
    const foundCategory = await this.findOne({ where: { title } });

    if (foundCategory) {
      return foundCategory;
    }

    const createdCategory = await this.create({ title });

    await this.save(createdCategory);

    return createdCategory;
  }
}

export default CategoriesRepository;
