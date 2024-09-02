<template>
  <div
    :style="{ padding: ifLarger ? '0 50px 0 0' : '0 20px' }"
    class="layout-header flex flex-direction-row-reverse justify-content-space-between align-items-center"
  >
    <div class="relative flex align-items-center justify-content-center bg-white">
      <common-nav-link v-if="ifLarger" :if-larger="ifLarger" @goHome="goHome" />
      <commonm-btn v-else class="nav" :wave-active="true" @click="toggleShowNavLink">
        导航
      </commonm-btn>
      <div
        class="relative flex align-items-center justify-content-center flex-nowrap flex-shrink-0 popup-wrap"
      >
        <commonm-btn
          style="margin-right: 1em"
          class="flex-shrink-0"
          :wave-active="true"
          @btnClick="showPopup = !showPopup"
        >
          通知
        </commonm-btn>
        <a
          title="我的github主页"
          href="https://github.com/a1392558812/myShare"
          target="_blank"
          class="cursor-pointer flex align-items-center justify-content-center github-link"
        >
          <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M10.9,2.1c-4.6,0.5-8.3,4.2-8.8,8.7c-0.5,4.7,2.2,8.9,6.3,10.5C8.7,21.4,9,21.2,9,20.8v-1.6c0,0-0.4,0.1-0.9,0.1 c-1.4,0-2-1.2-2.1-1.9c-0.1-0.4-0.3-0.7-0.6-1C5.1,16.3,5,16.3,5,16.2C5,16,5.3,16,5.4,16c0.6,0,1.1,0.7,1.3,1c0.5,0.8,1.1,1,1.4,1 c0.4,0,0.7-0.1,0.9-0.2c0.1-0.7,0.4-1.4,1-1.8c-2.3-0.5-4-1.8-4-4c0-1.1,0.5-2.2,1.2-3C7.1,8.8,7,8.3,7,7.6C7,7.2,7,6.6,7.3,6 c0,0,1.4,0,2.8,1.3C10.6,7.1,11.3,7,12,7s1.4,0.1,2,0.3C15.3,6,16.8,6,16.8,6C17,6.6,17,7.2,17,7.6c0,0.8-0.1,1.2-0.2,1.4 c0.7,0.8,1.2,1.8,1.2,3c0,2.2-1.7,3.5-4,4c0.6,0.5,1,1.4,1,2.3v2.6c0,0.3,0.3,0.6,0.7,0.5c3.7-1.5,6.3-5.1,6.3-9.3 C22,6.1,16.9,1.4,10.9,2.1z"
            />
          </svg>
        </a>
        <!-- 通知栏 -->
        <notice-popup v-model:showPopup="showPopup" :if-larger="ifLarger" />
      </div>
    </div>
    <!-- 移动端显示的切换菜单栏按钮 -->
    <commonm-btn v-if="!ifLarger && ifShowHeaderPopupBtn" :wave-active="true" @btnClick="menuOpen">
      <svg
        class="icon"
        style="
          width: 1em;
          height: 1em;
          vertical-align: middle;
          fill: currentColor;
          overflow: hidden;
        "
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2096"
      >
        <path
          d="M170.667 170.667h682.666a42.667 42.667 0 0 1 0 85.333H170.667a42.667 42.667 0 1 1 0-85.333z m0 298.666h682.666a42.667 42.667 0 0 1 0 85.334H170.667a42.667 42.667 0 0 1 0-85.334z m0 298.667h682.666a42.667 42.667 0 0 1 0 85.333H170.667a42.667 42.667 0 0 1 0-85.333z"
          p-id="2097"
        />
      </svg>
    </commonm-btn>
  </div>
</template>

<script>
import { ref, toRefs } from 'vue'

import commonmBtn from '@/components/commonm-btn/index.vue'
import commonNavLink from '@/components/nav-link/index.vue'
import noticePopup from './notice.vue'

import useGoHome from '@/hook/common/useGoHome'

export default {
  name: 'components-layout-header',
  components: {
    commonmBtn,
    commonNavLink,
    noticePopup
  },
  props: {
    headerH: {
      type: String,
      default: '50px'
    },
    ifLarger: {
      type: Boolean,
      default: true
    },
    ifShowHeaderPopupBtn: {
      type: Boolean,
      default: true
    },
    showNavLink: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const showPopup = ref(false)
    const { showNavLink } = toRefs(props)
    const toggleShowNavLink = () => {
      emit('toggleShowNavLink', !showNavLink.value)
    }
    const { goHome } = useGoHome(emit)

    return {
      showPopup,
      goHome,
      toggleShowNavLink,
      menuOpen: () => {
        emit('toggleMenu')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.layout-header {
  z-index: 3;
  padding: 0 50px;
  box-sizing: border-box;
  position: fixed;
  font-size: 16px;
  left: 0;
  top: 0;
  width: 100vw;
  color: var(--global-text-color);
  height: v-bind(headerH);
  background-color: var(--global-background-color);
  border-bottom: 1px solid var(--global-border-color);
  .nav {
    margin-right: 20px;
  }
  .popup-wrap {
    box-sizing: border-box;
  }
  .nav-link-small {
    width: 60%;
    background-color: red;
    border: 5px solid #000;
  }
  .github-link {
    font-size: 28px;
    color: var(--global-text-color);
  }
}
</style>
