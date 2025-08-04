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
  loading: false,
  error: null,
});

// 기존 주문 조회
const getOrder = async (id) => {
  try {
    state.loading = true;
    const response = await axios.get(`/order/${id}`);
    return response;
  } catch (error) {
    console.error("주문 조회 오류:", error);
    throw error;
  } finally {
    state.loading = false;
  }
};

// 상품 정보 조회
const getProduct = async (productId) => {
  try {
    const response = await axios.get(`/product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("상품 정보 조회 오류:", error);
    throw error;
  }
};

// 임시 주문 생성 (바로구매용)
const createDirectOrder = async (productData, quantity) => {
  try {
    const orderData = {
      type: "direct",
      items: [
        {
          productId: productData.id,
          name: productData.name,
          price: productData.price,
          quantity: quantity,
          imgPath: productData.imgPath,
        },
      ],
      amount: productData.price * quantity,
      status: "temp",
    };

    const response = await axios.post("/order/temp", orderData);
    return response.data;
  } catch (error) {
    console.error("임시 주문 생성 오류:", error);
    throw error;
  }
};

// 바로구매 처리
const handleDirectPurchase = async () => {
  try {
    const productId = route.query.productId;
    const quantity = parseInt(route.query.quantity) || 1;

    if (!productId) {
      throw new Error("상품 정보가 없습니다.");
    }

    // 상품 정보 조회
    const product = await getProduct(productId);

    // 임시 주문 생성
    const tempOrder = await createDirectOrder(product, quantity);

    // 주문 상태 업데이트
    state.order = {
      ...tempOrder,
      items: tempOrder.items || [],
    };
  } catch (error) {
    state.error = error.message;
    console.error("바로구매 처리 오류:", error);
  }
};

// 기존 주문 처리
const handleExistingOrder = async (orderId) => {
  try {
    const response = await getOrder(orderId);

    if (!response || response.status !== 200) {
      throw new Error("주문을 불러올 수 없습니다.");
    }

    state.order = response.data;
  } catch (error) {
    state.error = error.message;
    console.error("기존 주문 처리 오류:", error);
  }
};

// 날짜 포맷팅
const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleString("ko-KR");
  } catch (error) {
    return dateString;
  }
};

// 금액 포맷팅
const formatAmount = (amount) => {
  if (!amount) return "0";
  return amount.toLocaleString("ko-KR");
};

onMounted(async () => {
  state.loading = true;
  state.error = null;

  try {
    const orderId = route.params.id;

    if (orderId) {
      // 기존 주문 조회
      await handleExistingOrder(orderId);
    } else {
      // 바로구매 처리
      await handleDirectPurchase();
    }
  } catch (error) {
    state.error = "페이지를 불러오는 중 오류가 발생했습니다.";
    console.error("페이지 로드 오류:", error);
  } finally {
    state.loading = false;
  }
});
</script>

<template>
  <div class="order-detail py-5">
    <div class="container">
      <!-- 로딩 상태 -->
      <div v-if="state.loading" class="text-center py-5">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">주문 정보를 불러오는 중...</p>
      </div>

      <!-- 오류 상태 -->
      <div v-else-if="state.error" class="alert alert-danger" role="alert">
        {{ state.error }}
      </div>

      <!-- 주문 정보 -->
      <div v-else class="row">
        <div class="order col-lg-8">
          <div class="h5 mb-4">
            <b>주문 내용</b>
          </div>
          <table class="table table-bordered">
            <tbody>
              <tr>
                <th>주문 ID</th>
                <td>{{ state.order.id || "임시 주문" }}</td>
              </tr>
              <tr>
                <th>주문자명</th>
                <td>{{ state.order.name || "미입력" }}</td>
              </tr>
              <tr>
                <th>주소</th>
                <td>{{ state.order.address || "미입력" }}</td>
              </tr>
              <tr>
                <th>결제 금액</th>
                <td>{{ formatAmount(state.order.amount) }}원</td>
              </tr>
              <tr>
                <th>결제 수단</th>
                <td>
                  <span v-if="state.order.payment === 'card'">카드</span>
                  <span v-else-if="state.order.payment === 'bank'"
                    >무통장입금</span
                  >
                  <span v-else>미선택</span>
                </td>
              </tr>
              <tr>
                <th>주문 일시</th>
                <td>{{ formatDate(state.order.created) }}</td>
              </tr>
              <tr v-if="state.order.status">
                <th>주문 상태</th>
                <td>
                  <span
                    v-if="state.order.status === 'temp'"
                    class="badge bg-warning"
                    >임시 주문</span
                  >
                  <span
                    v-else-if="state.order.status === 'completed'"
                    class="badge bg-success"
                    >주문 완료</span
                  >
                  <span v-else class="badge bg-secondary">{{
                    state.order.status
                  }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="items col-lg-4">
          <div class="h5 mb-4">
            <b>주문 상품</b>
          </div>
          <div v-if="state.order.items && state.order.items.length > 0">
            <table class="table table-bordered">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>이미지</th>
                  <th>상품명</th>
                  <th>수량</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, idx) in state.order.items"
                  :key="item.id || idx"
                >
                  <td>{{ idx + 1 }}</td>
                  <td>
                    <img
                      :src="`/pic/item/${item.imgPath}`"
                      :alt="item.name"
                      class="item-image"
                      @error="$event.target.src = '/pic/item/default.jpg'"
                    />
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity || 1 }}개</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="text-center py-4">
            <p class="text-muted">주문 상품이 없습니다.</p>
          </div>
        </div>
      </div>

      <!-- 액션 버튼 (임시 주문인 경우) -->
      <div v-if="state.order.status === 'temp'" class="row mt-4">
        <div class="col-12 text-center">
          <button class="btn btn-primary btn-lg me-3" @click="proceedToPayment">
            결제하기
          </button>
          <button class="btn btn-secondary btn-lg" @click="goBack">
            뒤로가기
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-detail {
  min-height: 500px;

  .item-image {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  .container {
    table {
      th,
      td {
        padding: 15px 25px;
        vertical-align: middle;
      }

      th {
        background: #f8f9fa;
        font-weight: 600;
        color: #495057;
        width: 150px;
      }
    }
  }

  .spinner-border {
    width: 3rem;
    height: 3rem;
  }

  .badge {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  .btn-lg {
    padding: 0.75rem 2rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .order-detail {
    .container {
      table {
        th,
        td {
          padding: 10px 15px;
        }
      }
    }

    .item-image {
      width: 80px;
      height: 80px;
    }
  }
}
</style>

<script>
export default {
  name: "OrderDetail",
  methods: {
    proceedToPayment() {
      // 결제 페이지로 이동
      if (this.state.order.id) {
        this.$router.push(`/payment/${this.state.order.id}`);
      } else {
        alert("주문 정보가 없습니다.");
      }
    },

    goBack() {
      // 이전 페이지로 이동
      this.$router.go(-1);
    },
  },
};
</script>
