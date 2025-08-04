import axios from "./httpRequester";

// 회원가입
export const join = (args) => {
  return axios.post("/account/join", args).catch((e) => e.response);
};

// 로그인
export const login = (args) => {
  return axios.post("/account/login", args).catch((e) => e.response);
};

// 로그인 여부 확인
export const check = (args) => {
  return axios.get("/account/check", args).catch((e) => e.response);
};

// 로그아웃
export const logout = (args) => {
  return axios.post("/account/logout", args).catch((e) => e.response);
};
