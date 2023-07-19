import { atom } from "recoil";

export const isLoggedInState = atom({
  key: "isLoggedInState",
  default: false,
});
export const userInfoState = atom({
    key: "userInfoState",
    default: null,
  });

  