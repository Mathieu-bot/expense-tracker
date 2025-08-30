import { BadRequestError } from "../utils/errors.js";

export const validateIncomeData = () => (req, _res, next) => {
  const { amount, source, description } = req.body;
  const errors = [];

  if (amount !== undefined) {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      errors.push("Amount must be greater than 0");
    }
  }

  if (source && source.length > 100) {
    errors.push("Source cannot exceed 100 characters");
  }

  if (description && description.length > 500) {
    errors.push("Description cannot exceed 500 characters");
  }

  if (errors.length > 0) {
    return next(new BadRequestError("Validation failed", errors));
  }

  next();
};

export const validateDateRange = () => (req, _res, next) => {
  const { start, end } = req.query;
  const errors = [];

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (startDate > endDate) {
      errors.push("Start date cannot be after end date");
    }
  }

  if (errors.length > 0) {
    return next(new BadRequestError("Invalid date range", errors));
  }

  next();
};

export const requireIncomeFields = () => (req, _res, next) => {
  const { amount, date } = req.body;

  if (!amount || !date) {
    return next(
      new BadRequestError(
        "Missing required fields: amount and date are required"
      )
    );
  }

  next();
};

export const validateDateFormat = () => (req, _res, next) => {
  const { date } = req.body;

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return next(new BadRequestError("Invalid date format"));
    }
  }

  next();
};



export const sanitizeIncomeData = () => (req, _res, next) => {
  const { source, description } = req.body;

  if (typeof source === "string") {
    req.body.source = source.trim();
  }

  if (typeof description === "string") {
    req.body.description = description.trim();
  }

  next();
};

export const validateIncomeCreate = [
  requireIncomeFields(),
  sanitizeIncomeData(),
  validateDateFormat(),
  validateIncomeData(),
];

export const validateIncomeUpdate = [
  sanitizeIncomeData(),
  validateDateFormat(),
  validateIncomeData(),
];

export const validateIncomeQuery = [validateDateRange()];
