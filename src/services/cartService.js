import axios from "./httpRequester";

const path = "/cart";
// 장바구니 상품 추가
export const addItem = (itemId) => {
  return axios.post(path, { itemId }).catch((e) => e.response);
};

// 장바구니 상품 목록 조회
export const getItems = () => {
  return axios.get(path).catch((e) => e.response);
};

// 장바구니에서 상품 삭제
export const removeItem = (cartId) => {
  return axios.delete(`${path}/${cartId}`).catch((e) => e.response);
};

// 장바구니에서 전체 상품 삭제
export const removeAll = () => {
  return axios.delete(path).catch((e) => e.response);
};
