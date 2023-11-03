<template>
    <section>
        <!-- 背景色 -->
        <section data-background="#dddddd">
            <h2>鲁迅先生</h2>
            <p>
                <small>鲁迅（1881年9月25日～1936年10月19日），原名周樟寿，后改名周树人，字豫山，后改字豫才，浙江绍兴人。著名文学家、思想家、革命家、教育家、民主战士，新文化运动的重要参与者，中国现代文学的奠基人之一。</small>
            </p>
            <a href="#/16/1" class="navigate-down">
                <img class="r-frame" style="background: rgba(255,255,255,0.1); width: 180px;" :data-src="baseUrl + 'demo-static/filmstrip/luxun-images/luxun.jpg'" alt="鲁迅先生">
            </a>
        </section>
        <!-- 渐变色背景 -->
        <section data-background-gradient="linear-gradient(to bottom, #283b95, #17b2c3)">
            <h2>去除报警的方法：</h2>
            <p><small>vue用vscode打开老是提示[vue/no-parsing-error] Parsing error: x-invalid-end-tag.eslint-plugin-vue，但是标签都能匹配上啊，</small></p>
            <pre><code class="hljs html wrap">
                File->Preferences->Settings，
                搜索“vetur.validation.template”，
                将前面的勾去掉，
            </code></pre>
        </section>
        <section :data-background="baseUrl + 'demo-static/filmstrip/luxun-images/luxun.jpg'">
            <h2>"鲁迅先生"</h2>
            <pre><code class="hljs html">
                &lt;“鲁迅的骨头是最硬的，他没有丝毫的奴颜和媚骨。
                这是殖民地半殖民地人民最宝贵的性格。
                鲁迅是在文化战线上的民族英雄。”
                “鲁迅是中国文化革命的主将，
                他不但是伟大的文学家，
                而且是伟大的思想家和伟大的革命家。”&gt;
            </code></pre>
        </section>
        <section :data-background="baseUrl + 'demo-static/filmstrip/luxun-images/luxun.jpg'" data-background-repeat="repeat" data-background-size="100px">
            <h2>"鲁迅先生"</h2>
            <pre><code class="hljs html" style="word-wrap: break-word;">
                &lt;“鲁迅是真正的中国作家，
                正因为如此，
                他才给全世界文学贡献了很多民族形式的，
                不可模仿的作品。
                他的语言是民间形式的。
                他的讽刺和幽默虽然具有人类共同的性格，
                但也带有不可模仿的民族特点。”
                他又评价鲁迅为“中国的高尔基。”&gt;
            </code></pre>
        </section>
        <section :data-background-video="baseUrl + 'demo-static/filmstrip/video/video.mp4'" :data-background-video-loop="true" data-background-color="#000000">
            <div style="background-color: rgba(0, 0, 0, 0.9); color: #fff; padding: 20px;">
                <h2>Video Backgrounds</h2>
                <pre><code class="hljs html" style="word-wrap: break-word;">&lt;section data-background-video="video.mp4,video.webm"&gt;</code></pre>
            </div>
        </section>
        <section :data-background="baseUrl + 'demo-static/filmstrip/images/gif.gif'">
            <h2>oyixiおいしい</h2>
        </section>
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
