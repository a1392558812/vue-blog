<template>
  <section>
    <section id="fragments">
      <h2>看梅绝句</h2>
      <p>宋·陆游</p>
      <p class="fragment">老子舞时不须拍，</p>
      <p class="fragment">梅花乱插乌巾香。</p>
      <p class="fragment">尊前作剧莫相笑，</p>
      <p class="fragment">我死诸君思此生。</p>
      <aside class="notes">古诗一首，JS中常用的键盘事件与keycode属性</aside>
    </section>
    <section>
      <h2 style="vertical-align: bottom">
        赤壁怀古<span style="font-size: 20px">【宋】苏辙 </span>
      </h2>
      <p>新破荆州得水军，</p>
      <p class="fragment grow">鼓行夏口气如云。</p>
      <p class="fragment shrink">千艘已共长江崄，</p>
      <p class="fragment fade-out">百胜安知赤壁焚。</p>
      <p>
        <span class="fragment fade-right inline-block">觜距</span>
        <span class="fragment fade-up inline-block">方强</span>
        <span class="fragment fade-down inline-block">要</span>
        <span class="fragment fade-left inline-block">一斗，</span>
      </p>
      <p class="fragment fade-in-then-out">君臣已定势三分。</p>
      <p class="fragment fade-in-then-semi-out">古来伐国须观衅，</p>
      <p>
        <span class="fragment highlight-red">意突</span>
        <span class="fragment highlight-blue">成功</span>
        <span class="fragment highlight-green">所未闻。</span>
      </p>
    </section>
  </section>
</template>
<script setup>
defineOptions({ name: 'view-demo-filmstrip-section15' })
</script>
