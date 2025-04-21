import { RequestHandler } from "express";
import appAssert from "../utils/app.Assert";
import AppErrorCode from "../constants/appErrorCode";
import { UNAUTHORIZED } from "../constants/http";
import { verifyToken } from "../utils/jwt";
import { AccessTokenPayload } from "../utils/jwt"; // 👈 import the correct type

const authenticate: RequestHandler = (req, res, next) => {
  const accessToken = req.cookies.accessToken as string | undefined;

  appAssert(
    accessToken,
    UNAUTHORIZED,
    "Not authorized",
    AppErrorCode.InvalidAccessToken
  );

  // 👇 Call verifyToken with the correct payload type
  const result = verifyToken<AccessTokenPayload>(accessToken);
  console.log("Token Verification Result:", result);

  appAssert(
    result.payload,
    UNAUTHORIZED,
    result.error === "jwt expired" ? "Token expired" : "Invalid token",
    AppErrorCode.InvalidAccessToken
  );

  req.userId = result.payload.userId.toString();       // 👈 cast to string to fix TS
  req.sessionId = result.payload.sessionId?.toString(); // optional chaining for safety

  next();
};

export default authenticate;
