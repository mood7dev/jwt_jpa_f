<script setup>
import { getItems, removeItem, removeAll } from "@/services/cartService";
import { reactive, onMounted } from "vue";
import { computed } from "vue";

const state = reactive({ items: [] });
const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:8080";

const load = async () => {
  const res = await getItems();
  if (res === undefined || res.status !== 200) {
    return;
  }
  state.items = res.data;
};
const remove = async (cartId) => {
  const res = await removeItem(cartId);
  if (res === undefined || res.status !== 200) {
    return;
  }
  load();
  //다시 리로딩
  //or
  //방금 삭제한 객체만 state.items에서 삭제한다.
};

const clear = async () => {
  const res = await removeAll();
  if (res === undefined || res.status !== 200) {
    return;
  }
  state.items = [];
};

onMounted(() => {
  load();
});

// 총 합계 계산
const totalPrice = computed(() =>
  state.items.reduce((sum, i) => {
    if (i.price !== undefined && i.discountPer !== undefined) {
      return sum + (i.price - (i.price * i.discountPer) / 100);
    }
    return sum;
  }, 0)
);
</script>

<template>
  <h1 class="cart-title">Shopping Cart</h1>

  <div class="cart">
    <div class="container">
      <template v-if="state.items.length">
        <ul class="items">
          <li v-for="i in state.items" :key="i.id">
            <img
              :alt="`상품 사진(${i.name})`"
              :src="`${baseUrl}/pic/item/${i.imgPath}`"
            />

            <b class="name">{{ i.name }}</b>
            <span class="price">
              {{
                (i.price - (i.price * i.discountPer) / 100).toLocaleString()
              }}원
            </span>
            <span class="remove float-end" @click="remove(i.id)" title="삭제"
              >&times;</span
            >
          </li>
        </ul>
        <!-- 합계 표시 -->
        <div class="summary text-end my-3 pe-3">
          <div class="item-count">
            선택한 상품 <strong>{{ state.items.length }}</strong
            >개
          </div>
          <div class="total-price">
            총 합계: <strong>{{ totalPrice.toLocaleString() }}</strong
            >원
          </div>
        </div>

        <div class="act d-flex justify-content-end">
          <button @click="clear" class="btn btn-outline-dark custom-clear me-2">
            장바구니 비우기
          </button>
          <router-link to="/order" class="btn btn-black"
            >상품 주문하기</router-link
          >
        </div>
      </template>
      <div class="text-center py-5" v-else>장바구니가 비어있습니다.</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cart-title {
  font-family: "Noto Sans KR", sans-serif;
  font-weight: 600;
  font-size: 30px;
  color: #333;
  margin-top: 2rem;
  padding-bottom: 1.5rem;
  letter-spacing: -2.5px;
  text-align: center;
}

.cart {
  .items {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      border: 1px solid #eee;
      margin-top: 25px;
      margin-bottom: 25px;
    }
    img {
      width: 200px;
      height: 170px;
    }

    .name {
      margin-left: 25px;
    }

    .price {
      margin-left: 25px;
    }

    .remove {
      cursor: pointer;
      font-size: 30px;
      padding: 5px 15px;
    }
  }

  .act {
    display: flex; // flex 추가
    justify-content: flex-end; // 오른쪽 정렬
    gap: 10px;
    align-items: center;

    .btn {
      width: auto;
      padding: 10px 30px;
      font-size: 18px;
    }

    .btn-black {
      background-color: #000;
      color: #fff;
      border: 1px solid #000;
      padding: 10px 10px;
      font-size: 18px;
      transition: all 0.2s;

      &:hover {
        background-color: #333;
        border-color: #333;
        color: #fff;
      }
    }

    .custom-clear {
      background-color: #fff;
      color: #000;
      border: 1px solid #000;
      padding: 10px 10px;
      font-size: 18px;
      transition: all 0.2s;

      &:hover {
        background-color: #f8f9fa;
        color: #000;
      }
    }
  }

  .total {
    font-size: 20px;
    font-weight: bold;
  }

  .summary {
    margin: 0 -16px;
    padding: 20px;
    font-size: 18px;
    font-weight: 500;
    text-align: right;
    line-height: 1.6;

    .item-count,
    .total-price {
      white-space: nowrap;
    }
  }
}
</style>
