import { BAD_REQUEST } from "../../constants/HttpStatusCodes.js";
import APIError from "../../utils/APIError.js";

export type RegisterBody = {
  [key: string]: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: string;
};

export const bodyHasAllRequiredParameters = (body: RegisterBody) => {
  const requiredParams = [
    "firstName",
    "lastName",
    "email",
    "password",
    "birthDate",
    "gender",
  ];

  const invalidParams: { name: string; reason: string }[] = [];

  for (const param of requiredParams) {
    if (!Object.hasOwn(body, param)) {
      invalidParams.push({ name: param, reason: "must be provided" });
      continue;
    }

    if (typeof body[param] === "string" && body[param]?.trim() === "") {
      invalidParams.push({
        name: param,
        reason: "cannot be an empty string",
      });
    }
  }

  if (invalidParams.length > 0) {
    throw new APIError({
      status: BAD_REQUEST,
      title: "Missing data",
      detail: "Missing required fields",
      invalidParams: invalidParams,
    });
  }
};

const validateBodyTypes = () => {
  // This function should validate the type of each parameter
  return;
};

const validateBodyFormat = () => {
  return;
};

export const registerBodyValidation = (body: RegisterBody) => {
  // TODO: Parameter completeness
  // TODO: Parameter type validation
  // TODO: Parameter format validation
};
