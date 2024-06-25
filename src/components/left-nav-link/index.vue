<template>
  <div
    v-if="!ifLarger"
    :class="showNavLink ? 'translateX-0' : 'translateX-100'"
    class="absolute height100 bg-white flex-shrink-0 left-nav-link"
  >
    <common-nav-link
      :if-larger="ifLarger"
      @goHome="goHome"
      @toggleShowNavLink="toggleShowNavLink"
    />
  </div>
</template>

<script>
import commonNavLink from '@/components/nav-link/index.vue'
import useGoHome from '@/hook/common/useGoHome'
export default {
  name: 'LeftNavLink',
  components: {
    commonNavLink
  },
  props: {
    showNavLink: {
      type: Boolean,
      default: false
    },
    ifLarger: {
      type: Boolean,
      default: true
    },
    leftSidebarW: {
      type: String,
      default: '320px'
    }
  },
  setup (props, { emit }) {
    const { goHome } = useGoHome(emit)
    return {
      goHome,
      toggleShowNavLink: (state) => {
        emit('toggleShowNavLink', state)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.left-nav-link{
  width: v-bind(leftSidebarW);
  color: var(--global-text-color);
  font-size: 16px;
  transition: transform 0.3s;
  border-right: 1px solid var(--global-border-color);
  padding-left: 20px;
  box-sizing: content-box;
  z-index: 10;
}
</style>
