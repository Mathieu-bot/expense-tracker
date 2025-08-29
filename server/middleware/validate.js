import { BadRequestError } from "../utils/errors.js";
import isEmail from "validator/lib/isEmail.js";
import normalizeEmail from "validator/lib/normalizeEmail.js";
import isURL from "validator/lib/isURL.js";
import isStrongPassword from 'validator/lib/isStrongPassword.js';

export const requireFields =
  (...fields) =>
  (req, _res, next) => {
    for (const f of fields) {
      const v = req.body?.[f];
      if (v == null || v === "") {
        return next(new BadRequestError(`Missing field: ${f}`));
      }
    }
    next();
  };

// Normalize and validate email. Sets req.body.email to the normalized lowercase value.
export const validateEmail = () => (req, _res, next) => {
  const raw = String(req.body.email || "").trim();
  if (!isEmail(raw)) return next(new BadRequestError("Invalid email format"));
  const normalized = normalizeEmail(raw, {
    all_lowercase: true,
    gmail_remove_dots: false,
    gmail_remove_subaddress: false,
    outlookdotcom_remove_subaddress: false,
    yahoo_remove_subaddress: false,
    icloud_remove_subaddress: false,
  });
  req.body.email = normalized;
  next();
};

export const sanitizeBody =
  (...fields) =>
  (req, _res, next) => {
    for (const f of fields) {
      if (typeof req.body?.[f] === "string") {
        req.body[f] = req.body[f].trim();
      }
    }
    next();
  };

export const validateTextMaxLengths = (limits) => (req, _res, next) => {
  for (const [field, max] of Object.entries(limits || {})) {
    const v = req.body?.[field];
    if (typeof v === "string" && v.length > max) {
      return next(
        new BadRequestError(`${field} is too long (max ${max} characters)`)
      );
    }
  }
  next();
};

export const validateIdParam = (paramName) => (req, _res, next) => {
  const id = req.params[paramName];
  if (!id || isNaN(parseInt(id, 10))) {
    return next(new BadRequestError(`Invalid ID in parameter: ${paramName}`));
  }
  next();
};

export const validateCategoryCreate = [
  requireFields("name"),
  sanitizeBody("name", "icon_url"),
  validateTextMaxLengths({ name: 50 }),
  (_req, _res, next) => {
    const { icon_url } = _req.body;
    if (icon_url) {
      if (typeof icon_url !== "string" || icon_url.length > 255) {
        return next(
          new BadRequestError("icon_url is too long (max 255 characters)")
        );
      }
      if (!isURL(icon_url, { require_protocol: true })) {
        return next(new BadRequestError("Invalid URL format for icon_url"));
      }
    }
    next();
  },
];

export const validateCategoryUpdate = [
  sanitizeBody("name", "icon_url"),
  validateTextMaxLengths({ name: 50 }),
  (_req, _res, next) => {
    const { name, icon_url } = _req.body;
    if (name != null && name === "") {
      return next(new BadRequestError("name cannot be empty"));
    }
    if (icon_url) {
      if (typeof icon_url !== "string" || icon_url.length > 255) {
        return next(
          new BadRequestError("icon_url is too long (max 255 characters)")
        );
      }
      if (!isURL(icon_url, { require_protocol: true })) {
        return next(new BadRequestError("Invalid URL format for icon_url"));
      }
    }
    next();
  },
];

// Combined middlewares for cleaner routes
export const validateSignup = [
  requireFields("email", "password"),
  validateEmail(),
  sanitizeBody("username", "firstname", "lastname"),
  validateTextMaxLengths({ username: 50, firstname: 50 }),
];

export const validateLogin = [
  requireFields("email", "password"),
  validateEmail(),
];

//--------------------USER PROFILE VALIDATIONS
export const validateUpdateProfile = [
  sanitizeBody("firstname", "lastname", "username"),
  validateTextMaxLengths({
    firstname: 100,
    lastname: 100,
    username: 50,
  }),
  (req, _res, next) => {
    const { firstname, lastname, username } = req.body;

    //check if at least one field is provided
    if (
      firstname === undefined &&
      lastname === undefined &&
      username === undefined
    ) {
      return next(
        new BadRequestError("At least one field is required for update")
      );
    }

    if (username !== undefined && username === "") {
      return next(new BadRequestError("Username cannot be empty"));
    }

    next();
  },
];

export const validateChangePassword = [
  requireFields("currentPassword", "newPassword"),
  (req, _res, next) => {
    const { newPassword } = req.body;

    if (
      !isStrongPassword(String(newPassword), {
        minLength: 6,
        minLowercase: 0,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    ) {
      return next(
        new BadRequestError(
          "New password must be at least 6 characters and include at least one uppercase letter and one number"
        )
      );
    }

    next();
  },
];
