<template>
    <section>
        <img :src="baseUrl + 'demo-static/filmstrip/luxun-images/luxun.jpg'" alt="" style="width: 180px; margin: 0 auto 4rem auto; background: transparent;" class="demo-logo">
        <h3>伟大的鲁迅先生</h3>
        <p>
            <small>鲁迅（1881年9月25日～1936年10月19日），原名周樟寿，后改名周树人，字豫山，后改字豫才，浙江绍兴人。著名文学家、思想家、革命家、教育家、民主战士，新文化运动的重要参与者，中国现代文学的奠基人之一。</small>
        </p>
        <p>
            <small>space下一页，enter上一页</small>
        </p>
    </section>
</template>
<script setup>
import { defineProps } from 'vue'
defineProps({
  baseUrl: {
    type: String,
    default: ''
  }
})
</script>
