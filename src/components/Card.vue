<script setup>
import { computed } from "vue";
import { addItem } from "@/services/cartService";
import { ref, onMounted } from "vue";

const orderItem = ref(null);

onMounted(() => {
  const item = localStorage.getItem("orderItem");
  if (item) {
    orderItem.value = JSON.parse(item);
    console.log("Loaded orderItem:", orderItem.value);
  } else {
    console.warn("No orderItem in localStorage");
  }
});

// 프로퍼티 객체
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

// 상품 할인가 계산
const computedItemDiscountPrice = computed(() => {
  return (
    (
      props.item.price -
      (props.item.price * props.item.discountPer) / 100
    ).toLocaleString() + "원"
  );
});

// 장바구니에 상품 담기
const put = async () => {
  const res = await addItem(props.item.id).catch((e) => e.response);
  if (!res) {
    alert("장바구니 요청 실패");
    return;
  }

  if (res.status === 409) {
    console.log("res.status:", res.status);
    alert("이미 장바구니에 있는 상품입니다.");
    return;
  }
  // 로그인 된 상태라면 장바구니 담기 API 호출
  if (res.status === 401 || res.status === 403) {
    const goLogin = confirm(
      "로그인이 필요합니다. 로그인 페이지로 이동하시겠습니까?"
    );
    if (goLogin) {
      window.location.href = "/login";
    }
    return;
  }

  if (res.status !== 200) {
    console.log("res.status: ", res.status);
    alert("장바구니 요청 실패");
    return;
  }

  //장바구니로 가기
  const goCart = confirm(
    "상품을 장바구니에 담았습니다. 장바구니로 이동하시겠습니까?"
  );
  if (goCart) {
    window.location.href = "/cart";
  }
};

const buy = () => {
  window.location.href = "/order";
};

const computedDiscountRate = computed(() => {
  return String(props.item.discountPer ?? 0);
});
</script>

<template>
  <div class="card shadow-sm">
    <!-- 상품 사진 -->
    <span
      class="img"
      :style="{
        backgroundImage: `url(http://localhost:8080/pic/item/${props.item.imgPath})`,
      }"
      :aria-label="`상품사진(${props.item.name})`"
    ></span>
    <div class="card-body">
      <div class="card-text">
        <span class="me-2">{{ props.item.name }}</span>
      </div>

      <div class="price-info">
        <div class="price-left">
          <!-- 상품 할인가 -->
          <div class="DiscountedPrice">
            <small class="real text">{{ computedItemDiscountPrice }}</small>
          </div>
          <!-- 상품 정가 -->
          <div class="OriginalPrice">
            <small class="price text-muted"
              >{{ props.item.price.toLocaleString() }}원</small
            >
          </div>
        </div>
        <!-- 상품 할인율 -->
        <div class="DiscountRate">
          <small class="discount-rate text-danger"
            >{{ computedDiscountRate }}%</small
          >
        </div>
      </div>

      <div class="d-flex justify-content-center align-items-center mt-3">
        <button class="btn btn-black btn-sm" @click="put()">장바구니</button>
        <button class="btn btn-naver-green btn-sm" @click="buy()">
          바로구매
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* 카드 컴포넌트 전체에 한글 폰트 적용 */
.card {
  font-family: "Noto Sans KR", sans-serif;

  /* 상품 이미지 스타일 */
  .img {
    display: inline-block;
    width: 100%;
    height: 280px;
    background-size: cover;
    background-position: center;
  }

  /* 상품 정가 텍스트에 취소선 적용 */
  .card-body .price {
    text-decoration: line-through;
  }

  /* 가격 영역 전체 */
  .price-info {
    display: flex;
    justify-content: space-between; /* 좌측은 가격들, 우측은 할인율 배치 */
    align-items: center;
  }

  /* 상품 할인가 */
  .DiscountedPrice {
    font-weight: 700;
    color: #000;
    font-size: 27px;
    margin-left: 8px;
  }

  /* 상품 정가 및 할인율 묶음 컨테이너: 정가와 할인율 간격 조절 */
  .OriginalPrice {
    display: flex;
    align-items: center;
    gap: 6px; /* 정가와 할인율 사이 간격 */
    color: #adb5bd;
  }

  /* 정가 텍스트에 취소선 표시 */
  .OriginalPrice .price {
    text-decoration: line-through;
  }

  /* 정가 왼쪽 정렬 */
  .price-left {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  /* 할인율 */
  .DiscountRate .discount-rate {
    font-weight: 700;
    color: #dc3545;
    margin-left: -35px;
  }

  /* 할인율 강조 텍스트 */
  .discount-rate.text-danger {
    font-size: 30px;
    font-weight: bold;
  }

  /* 검정색 버튼 스타일 */
  .btn-black {
    background-color: #000;
    color: #fff;
    font-size: 16px;
    border: none;
    border-radius: 0 !important;
    padding: 13px 67px;
    min-width: 120px;
    font-weight: bold;

    &:hover {
      background-color: #333;
      color: #fff;
      border-color: #333;
    }
  }

  /* 네이버 그린 버튼 스타일 */
  .btn-naver-green {
    background-color: #deff2c;
    color: #000;
    font-size: 16px;
    border: none;
    border-radius: 0 !important;
    padding: 13px 67px;
    min-width: 120px;
    font-weight: bold;

    &:hover {
      background-color: #a2e534;
    }
  }

  /* 상품 이름 텍스트 스타일 */
  .card-text > .me-2 {
    font-size: 17px;
    font-weight: 500;
    color: #adb5bd;
  }
}
</style>
