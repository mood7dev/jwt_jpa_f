<script setup>
import { getItems } from "@/services/itemService";
import { reactive, onMounted } from "vue";
import Card from "@/components/Card.vue";

// 반응형 상태
const state = reactive({
  items: [],
});

// 마운트될 때 한 번만 getItems 호출
onMounted(async () => {
  const res = await getItems();
  if (res.status !== 200) {
    return;
  }
  console.log("res.data: ", res.data);
  state.items = res.data;

  // 이미지 경로 가공 추가
  state.items = res.data.map((item) => ({
    ...item,
    imPath: `/images/${item.imgPath}`,
  }));
});
</script>

<template>
  <div class="home">
    <div class="container">
      <h1 class="custom-title">
        ┃ scent the dream<span class="clover"></span>
      </h1>
    </div>

    <div class="album py-5 bg-white">
      <div class="container">
        <div class="row row-cols-1 row-cols-lg-2 row-cols-xl-3 g-3">
          <div class="col" v-for="item in state.items" :key="item.id">
            <Card :item="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-title {
  font-weight: 700;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  margin-top: 3rem;
  font-size: 2.5rem;
}

.clover {
  margin-left: -9px;
  font-size: 25px;
}
</style>
