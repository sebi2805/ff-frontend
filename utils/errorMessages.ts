const errorMessages: { [key: string]: string } = {
  USER_DELETED: "Your account has been deleted.",
  USER_NOT_VERIFIED: "The account is not verified. Please check your email.",
  USER_ROLE_DOES_NOT_MATCH: "The user's role does not match.",
  NO_USER: "User not found.",
  USER_ALREADY_EXISTS: "A user with this email already exists.",
  INCORRECT_PASSWORD: "The password entered is incorrect.",
  UNAUTHORIZED: "You are not authorized to access this resource.",
  EXPIRED_JWT: "The session has expired. Please log in again.",
  NO_ENTITY: "The requested entity was not found.",
  INVALID_TOKEN: "The provided token is invalid.",
  TOKEN_EXPIRED: "The token has expired.",
  INVALID_PASSWORD: "The password does not meet the security requirements.",
  INVALID_EMAIL: "The email address is not valid.",
  SENDGRID_API_KEY_NOT_FOUND: "Internal error. Please try again later.",
};

export const decodeErrorMessage = (error: any): string => {
  const friendlyMessage = errorMessages[error];
  if (friendlyMessage) {
    return friendlyMessage;
  } else {
    return error || "Unknown error";
  }
};
