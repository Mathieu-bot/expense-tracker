/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const DEFAULT_CATEGORIES = [
  { category_name: 'Rent', icon_url: null },
  { category_name: 'Electricity', icon_url: null },
  { category_name: 'Water', icon_url: null },
  { category_name: 'Internet', icon_url: null },
  { category_name: 'Phone', icon_url: null },
  { category_name: 'Transport', icon_url: null },
  { category_name: 'Fuel', icon_url: null },
  { category_name: 'Parking', icon_url: null },
  { category_name: 'Groceries', icon_url: null },
  { category_name: 'Restaurant', icon_url: null },
  { category_name: 'Entertainment', icon_url: null },
  { category_name: 'Subscriptions', icon_url: null },
  { category_name: 'Health', icon_url: null },
  { category_name: 'Pharmacy', icon_url: null },
  { category_name: 'Insurance', icon_url: null },
  { category_name: 'Education', icon_url: null },
  { category_name: 'Gifts & Donations', icon_url: null },
  { category_name: 'Travel', icon_url: null },
  { category_name: 'Personal Care', icon_url: null },
  { category_name: 'Misc', icon_url: null },
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
        icon_url: item.icon_url,
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
