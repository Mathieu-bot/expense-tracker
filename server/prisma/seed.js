import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function ensureUser(data) {
  return prisma.user.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  });
}

async function ensureExpenseCategory(category_name, opts = {}) {
  const { user_id = null, is_custom = false, icon_url = null } = opts;
  const existing = await prisma.expenseCategory.findFirst({
    where: { category_name, user_id: user_id ?? null },
    select: { category_id: true },
  });
  if (existing) return existing.category_id;
  const created = await prisma.expenseCategory.create({
    data: { category_name, user_id, is_custom, icon_url },
    select: { category_id: true },
  });
  return created.category_id;
}

async function ensureIncomeCategory(category_name, opts = {}) {
  const { user_id = null, is_custom = false, icon_url = null } = opts;
  const existing = await prisma.incomeCategory.findFirst({
    where: { category_name, user_id: user_id ?? null },
    select: { category_id: true },
  });
  if (existing) return existing.category_id;
  const created = await prisma.incomeCategory.create({
    data: { category_name, user_id, is_custom, icon_url },
    select: { category_id: true },
  });
  return created.category_id;
}

async function main() {
  // --- Users ---
  const jane = await ensureUser({
    username: "jane_doe",
    email: "jane@example.com",
    hashed_password: "bcrypt$dummyhash$jane", // remplace par un vrai hash
    firstname: "Jane",
    lastname: "Doe",
  });

  const john = await ensureUser({
    username: "john_smith",
    email: "john@example.com",
    hashed_password: "bcrypt$dummyhash$john",
    firstname: "John",
    lastname: "Smith",
  });

  // --- Default categories (global = user_id null) ---
  const defaultExpenseCats = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Rent",
    "Utilities",
  ];
  const defaultIncomeCats = [
    "Salary",
    "Freelance",
    "Investments",
    "Gifts",
    "Other",
  ];

  const expCatIdsGlobal = {};
  for (const name of defaultExpenseCats) {
    expCatIdsGlobal[name] = await ensureExpenseCategory(name);
  }
  const incCatIdsGlobal = {};
  for (const name of defaultIncomeCats) {
    incCatIdsGlobal[name] = await ensureIncomeCategory(name);
  }

  // --- Custom categories for Jane ---
  const catCoffee = await ensureExpenseCategory("Coffee", {
    user_id: jane.user_id,
    is_custom: true,
  });
  const catSideHustle = await ensureIncomeCategory("Side Hustle", {
    user_id: jane.user_id,
    is_custom: true,
  });

  // --- Sample expenses for Jane ---
  await prisma.expense.createMany({
    data: [
      {
        amount: 45000,
        description: "Supermarket",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-02"),
        user_id: jane.user_id,
        category_id: expCatIdsGlobal["Food"],
      },
      {
        amount: 15000,
        description: "Bus card",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-03"),
        user_id: jane.user_id,
        category_id: expCatIdsGlobal["Transport"],
      },
      {
        amount: 60000,
        description: "Clothes",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-05"),
        user_id: jane.user_id,
        category_id: expCatIdsGlobal["Shopping"],
      },
      {
        amount: 250000,
        description: "Monthly rent",
        type: "RECURRING",
        expense_date: new Date("2025-08-01"),
        user_id: jane.user_id,
        category_id: expCatIdsGlobal["Rent"],
      },
      {
        amount: 8000,
        description: "Latte",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-06"),
        user_id: jane.user_id,
        category_id: catCoffee,
      },
    ],
    skipDuplicates: true, // n'empêche pas les doublons ici (pas d'unique), mais OK si relancé sans delete
  });

  // --- Sample incomes for Jane ---
  await prisma.income.createMany({
    data: [
      {
        amount: 1_200_000,
        date: new Date("2025-08-01"),
        source: "Company X",
        description: "Monthly salary",
        user_id: jane.user_id,
        category_id: incCatIdsGlobal["Salary"],
      },
      {
        amount: 300_000,
        date: new Date("2025-08-10"),
        source: "Freelance UI work",
        description: "Landing page",
        user_id: jane.user_id,
        category_id: incCatIdsGlobal["Freelance"],
      },
      {
        amount: 120_000,
        date: new Date("2025-08-12"),
        source: "Etsy shop",
        description: "Side hustle payout",
        user_id: jane.user_id,
        category_id: catSideHustle,
      },
    ],
    skipDuplicates: true,
  });

  // --- A couple of rows for John as well ---
  await prisma.expense.createMany({
    data: [
      {
        amount: 38000,
        description: "Groceries",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-04"),
        user_id: john.user_id,
        category_id: expCatIdsGlobal["Food"],
      },
      {
        amount: 120000,
        description: "Electricity bill",
        type: "ONE_TIME",
        expense_date: new Date("2025-08-07"),
        user_id: john.user_id,
        category_id: expCatIdsGlobal["Utilities"],
      },
    ],
  });

  await prisma.income.createMany({
    data: [
      {
        amount: 900_000,
        date: new Date("2025-08-01"),
        source: "Company Y",
        description: "Salary",
        user_id: john.user_id,
        category_id: incCatIdsGlobal["Salary"],
      },
      {
        amount: 80_000,
        date: new Date("2025-08-09"),
        source: "Dividends",
        description: "ETF payout",
        user_id: john.user_id,
        category_id: incCatIdsGlobal["Investments"],
      },
    ],
  });

  console.log("✅ Seed done.");
}

main()
  .catch((e) => {
    console.error("❌ Seed error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
