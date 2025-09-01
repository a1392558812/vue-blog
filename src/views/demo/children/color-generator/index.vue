<template>
  <div class="max-w-[1200px] mx-[auto] my-[0]">
    <header class="text-center mb-[40px] px-[0] py-[20px]">
      <h1 class="text-[2.5rem] mb-[10px]">配色生成器</h1>
      <p class="text-[1.1rem] max-w-[600px] mx-[auto] my-[0] text-[#666]">选择一个主题色，自动生成7个和谐配色和3个辅色</p>
    </header>

    <section
      class="bg-[var(--card-bg)] p-[25px] rounded-[var(--border-radius)] [box-shadow:var(--box-shadow)] mb-[30px] text-center">
      <h2>选择主题色</h2>
      <div class="color-input flex justify-center items-center gap-[15px] mt-[20px]">
        <input type="color" v-model="primaryColor" @input="generatePalettes">
        <div class="text-[1.2rem] [font-weight:500]">当前选择: {{ primaryColor }}</div>
      </div>
    </section>

    <div class="palettes-container">
      <div class="bg-[var(--card-bg)] rounded-[var(--border-radius)] overflow-hidden [box-shadow:var(--box-shadow)]">
        <div class="px-[20px] py-[15px] [font-weight:600] text-[1.1rem] [border-bottom:1px_solid_rgba(0,_0,_0,_0.05)]">
          主配色方案
        </div>
        <div class="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))]">
          <div
            class="color-item h-[120px] flex flex-col justify-end p-[12px] cursor-pointer [transition:transform_0.2s_ease]"
            v-for="(color, index) in mainPalette" :key="'main-' + index" :style="{ backgroundColor: color }"
            @click="copyToClipboard(color)">
            <span
              class="bg-[rgba(255,_255,_255,_0.9)] px-[8px] py-[5px] rounded-[4px] font-[monospace] text-[0.9rem] mt-[8px] inline-block">{{
                color }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[var(--card-bg)] rounded-[var(--border-radius)] overflow-hidden [box-shadow:var(--box-shadow)]">
        <div class="px-[20px] py-[15px] [font-weight:600] text-[1.1rem] [border-bottom:1px_solid_rgba(0,_0,_0,_0.05)]">
          辅助配色方案</div>
        <div class="grid grid-cols-[repeat(auto-fit,_minmax(100px,_1fr))]">
          <div
            class="color-item h-[120px] flex flex-col justify-end p-[12px] cursor-pointer [transition:transform_0.2s_ease]"
            v-for="(color, index) in accentPalette" :key="'accent-' + index" :style="{ backgroundColor: color }"
            @click="copyToClipboard(color)">
            <span
              class="bg-[rgba(255,_255,_255,_0.9)] px-[8px] py-[5px] rounded-[4px] font-[monospace] text-[0.9rem] mt-[8px] inline-block">{{
                color }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center p-[20px] text-[#777] text-[0.9rem]">
      <p>点击颜色块可复制色值到剪贴板</p>
    </div>

    <div :style="showToast ? { opacity: 1 } : {}"
      class="fixed top-[20px] left-1/2 -translate-x-1/2 bg-[#333] text-[white] px-[20px] py-[12px] rounded-[4px] opacity-0 [transition:opacity_0.3s_ease]">
      已复制 {{ copiedColor }} 到剪贴板</div>
  </div>
</template>
<script>
import { ref } from 'vue'
export default {
  setup() {
    const primaryColor = ref('#4a6cf7');
    const mainPalette = ref([]);
    const accentPalette = ref([]);
    const showToast = ref(false);
    const copiedColor = ref('');

    // 将十六进制颜色转换为RGB对象
    const hexToRgb = (hex) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    // 将RGB对象转换为十六进制颜色
    const rgbToHex = (r, g, b) => {
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    // 生成配色方案
    const generatePalettes = () => {
      const baseRgb = hexToRgb(primaryColor.value);
      if (!baseRgb) return;

      // 生成主配色（7个颜色）
      const mainColors = [];
      mainColors.push(primaryColor.value); // 原始颜色

      // 生成不同亮度的颜色
      for (let i = 1; i <= 3; i++) {
        mainColors.push(adjustBrightness(baseRgb, 0.2 * i));
      }

      for (let i = 1; i <= 3; i++) {
        mainColors.push(adjustBrightness(baseRgb, -0.2 * i));
      }

      // 生成辅助配色（3个颜色）
      const accentColors = [];

      // 生成互补色
      accentColors.push(getComplementaryColor(baseRgb));

      // 生成类似色（色相偏移±30）
      accentColors.push(adjustHue(baseRgb, 30));
      accentColors.push(adjustHue(baseRgb, -30));

      mainPalette.value = mainColors;
      accentPalette.value = accentColors;
    }

    // 调整亮度
    const adjustBrightness = (rgb, factor) => {
      let r = Math.max(0, Math.min(255, Math.floor(rgb.r + factor * 255)));
      let g = Math.max(0, Math.min(255, Math.floor(rgb.g + factor * 255)));
      let b = Math.max(0, Math.min(255, Math.floor(rgb.b + factor * 255)));
      return rgbToHex(r, g, b);
    }

    // 获取互补色
    const getComplementaryColor = (rgb) => {
      return rgbToHex(255 - rgb.r, 255 - rgb.g, 255 - rgb.b);
    }

    // 调整色相
    const adjustHue = (rgb, degrees) => {
      // 简化版的色相调整
      const max = Math.max(rgb.r, rgb.g, rgb.b);

      let r = rgb.r, g = rgb.g, b = rgb.b;

      if (max === rgb.r) {
        r = Math.max(0, Math.min(255, rgb.r));
        g = Math.max(0, Math.min(255, rgb.g + degrees));
        b = Math.max(0, Math.min(255, rgb.b + degrees));
      } else if (max === rgb.g) {
        r = Math.max(0, Math.min(255, rgb.r + degrees));
        g = Math.max(0, Math.min(255, rgb.g));
        b = Math.max(0, Math.min(255, rgb.b + degrees));
      } else {
        r = Math.max(0, Math.min(255, rgb.r + degrees));
        g = Math.max(0, Math.min(255, rgb.g + degrees));
        b = Math.max(0, Math.min(255, rgb.b));
      }

      return rgbToHex(r, g, b);
    }

    // 复制到剪贴板
    const copyToClipboard = (color) => {
      navigator.clipboard.writeText(color).then(() => {
        copiedColor.value = color;
        showToast.value = true;
        setTimeout(() => {
          showToast.value = false;
        }, 2000);
      });
    }

    // 初始生成一次配色
    generatePalettes();

    return {
      primaryColor,
      mainPalette,
      accentPalette,
      showToast,
      copiedColor,
      generatePalettes,
      copyToClipboard
    };
  }
}
</script>

<style>
:root {
  --primary-color: #4a6cf7;
  --bg-color: #f8f9fa;
  --text-color: #333;
  --card-bg: #fff;
  --border-radius: 8px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

body {
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 20px;
  line-height: 1.6;
}

#app,
#page {
  height: 100%;
}
</style>

<style scoped lang="scss">
.palettes-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

input[type="color"] {
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
  }
}

.color-item:hover {
  transform: scale(1.03);
  z-index: 2;
}


@media (max-width: 768px) {
  .color-input {
    flex-direction: column;
  }

  .palettes-container {
    grid-template-columns: 1fr;
  }
}
</style>