<script setup>
import { reactive, onMounted } from "vue";
import { getOrders } from "@/services/OrderService";

const state = reactive({
  orders: [],
});

const load = async () => {
  const res = await getOrders();
  console.log("한글:", res);
  if (res === undefined || res.status !== 200) {
    alert("오류발생");
    return;
  }
  state.orders = res.data;
};

onMounted(async () => {
  await load();
});
</script>

<template>
  <div class="orders">
    <div class="container">
      <table class="table table-bordered my-4">
        <thead>
          <tr>
            <th class="text-center">번호</th>
            <th>주문자명</th>
            <th>결제 수단</th>
            <th>결제 금액</th>
            <th>결제 일시</th>
            <th>자세히 보기</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(o, idx) in state.orders" :key="o.id">
            <td class="text-center">{{ state.orders.length - idx }}</td>
            <td>{{ o.name }}</td>
            <td>{{ o.payment === "card" ? "카드" : "무통장입금" }}</td>
            <td>{{ o.amount.toLocaleString() }}</td>
            <td>{{ o.created.toLocaleString() }}</td>
            <td>
              <router-link :to="`/orders/${o.id}`">자세히보기</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped></style>
