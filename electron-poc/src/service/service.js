import { getApi, postApi, putApi } from "./api/index";

//User
export const CreateUser = (data) => postApi("user", data);
export const GetAllUsers = () => getApi("user");
export const GetUserProfile = (userID) => getApi(`user/${userID}`);
export const UpdateuserProfile = (userID, data) =>
  putApi(`user/${userID}`, data);
