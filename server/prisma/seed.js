/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { category_name: 'Rent' },
  { category_name: 'Electricity' },
  { category_name: 'Water' },
  { category_name: 'Internet' },
  { category_name: 'Phone' },
  { category_name: 'Transport' },
  { category_name: 'Fuel' },
  { category_name: 'Parking' },
  { category_name: 'Groceries' },
  { category_name: 'Restaurant' },
  { category_name: 'Entertainment' },
  { category_name: 'Subscriptions' },
  { category_name: 'Health' },
  { category_name: 'Pharmacy' },
  { category_name: 'Insurance' },
  { category_name: 'Education' },
  { category_name: 'Gifts & Donations' },
  { category_name: 'Travel' },
  { category_name: 'Personal Care' },
  { category_name: 'Misc' },
];

const main = async () => {
  console.log('Seeding global expense categories (user_id: null)...');

  for (const item of DEFAULT_CATEGORIES) {
    const exists = await prisma.expenseCategory.findFirst({
      where: {
        user_id: null,
        category_name: { equals: item.category_name, mode: 'insensitive' },
      },
    });

    if (exists) {
      console.log(`exists: ${item.category_name}`);
      continue;
    }

    await prisma.expenseCategory.create({
      data: {
        category_name: item.category_name,
        is_custom: false,
        user_id: null,
      },
    });
    console.log(`created: ${item.category_name}`);
  }
  console.log('Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
