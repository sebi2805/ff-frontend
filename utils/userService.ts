import { RegisterPayload } from "../interfaces/login";
// import apiClient from "./apiClient";

export async function registerUser(payload: RegisterPayload) {
  //   try {
  //     const response = await apiClient.post("/api/Users/register", payload);
  //     return response;
  //   } catch (err) {
  //     console.error("Registration error: ", err);
  //     throw new Error("Registration Failed");
  //   }
  console.log("simulating api call for ", payload);
  return 200;
}

export async function verifyToken(token: string) {
  // try{
  //     const response = await apiClient.post("/api/Users/token", token);
  //     return response;
  // }
  // catch(err){
  //     console.error("Token verification error: ", err)
  //     throw new Error("Incorrect token");
  // }
  if (token === "8008") return 200;
  else return 401;
}
