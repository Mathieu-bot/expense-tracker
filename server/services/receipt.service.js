import prisma from "../db/prisma.js";
export const getReceiptByExpenseId = async (user_id, expense_id) => {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { expense_id: parseInt(expense_id), user_id: parseInt(user_id) },
      select: { filename: true, mime_type: true, bytes: true },
    });
    return receipt;
  } catch (error) {
    console.error(error);
  }
};
