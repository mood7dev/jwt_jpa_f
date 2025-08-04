<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";
import { useRoute } from "vue-router";

const route = useRoute();

const state = reactive({
  order: {
    id: 0,
    name: "",
    address: "",
    payment: "",
    amount: 0,
    created: "",
    items: [],
  },
});

const getOrder = async (id) => {
  return axios.get(`/order/${id}`);
};

onMounted(async () => {
  const orderId = route.params.id;

  if (orderId) {
    // 기존처럼 API 호출
    const res = await getOrder(orderId);
    if (res === undefined || res.status !== 200) {
      alert("오류 발생");
      return;
    }
    state.order = res.data;
  } else {
    // route.params.id 없으면 바로구매로 왔다는 뜻
    const orderItemStr = localStorage.getItem("orderItem");
    if (!orderItemStr) {
      alert("주문할 상품 정보가 없습니다.");
      return;
    }
    const orderItem = JSON.parse(orderItemStr);
    // localStorage에서 바로구매 상품 정보를 이용해서 order 객체 직접 세팅
    state.order = {
      id: 0,
      name: "", // 필요하면 로그인 사용자 이름 등으로 채우기
      address: "",
      payment: "",
      amount: orderItem.price,
      created: new Date().toISOString(),
      items: [orderItem],
    };
  }
});
</script>

<template>
  <div class="order-detail py-5">
    <div class="container">
      <div class="row">
        <div class="order col-lg-8">
          <div class="h5 mb-4">
            <b>주문 내용</b>
          </div>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th>주문 ID</th>
                <td>{{ state.order.id }}</td>
              </tr>
              <tr>
                <th>주문자명</th>
                <td>{{ state.order.name }}</td>
              </tr>
              <tr>
                <th>주소</th>
                <td>{{ state.order.address }}</td>
              </tr>
              <tr>
                <th>결제 금액</th>
                <td>{{ state.order.amount.toLocaleString() }}원</td>
              </tr>
              <tr>
                <th>결제 수단</th>
                <td>
                  {{ state.order.payment === "card" ? "카드" : "무통장입금" }}
                </td>
              </tr>
              <tr>
                <th>결제 일시</th>
                <td>{{ state.order.created.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="items col-lg-4">
          <div class="h5 mb-4">
            <b>주문 상품</b>
          </div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>번호</th>
                <th>이미지</th>
                <th>상품명</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in state.order.items" :key="item.id">
                <td>{{ idx + 1 }}</td>
                <td><img :src="`/pic/item/${item.imgPath}`" alt="테스트" /></td>
                <td>{{ item.name }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
table img {
  width: 150px;
}
.order-detail {
  > .container {
    table {
      th,
      td {
        padding: 15px 25px;
      }
      th {
        background: #f7f7f7;
      }
    }
  }
}
</style>
