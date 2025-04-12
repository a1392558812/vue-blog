<template>
  <div ref="target" style="z-index: 1" class="relative cell list-cell">
    <div
      title="整理菜单"
      class="absolute align-center-y flex items-center justify-center cursor-pointer menu-list-close"
      @click="menuListCloseAll"
    >
      <svg
        style="
          width: 1em;
          height: 1em;
          margin-left: -2px;
          vertical-align: middle;
          fill: currentColor;
          overflow: hidden;
        "
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="27655"
      >
        <path
          d="M0 1024h1024v-170.666667H0v170.666667z m0-426.666667h1024V426.666667H0v170.666666z m0-597.333333v170.666667h1024V0H0z"
          p-id="27656"
        ></path>
      </svg>
    </div>
    <div class="relative w-[100%] h-[100%] flex items-center justify-between">
      <div class="relative">
        <div class="input relative">
          <svg
            class="icon absolute align-center-y"
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
            p-id="3269"
          >
            <path
              d="M416 192C537.6 192 640 294.4 640 416S537.6 640 416 640 192 537.6 192 416 294.4 192 416 192M416 128C256 128 128 256 128 416S256 704 416 704 704 576 704 416 576 128 416 128L416 128zM832 864c-6.4 0-19.2 0-25.6-6.4l-192-192c-12.8-12.8-12.8-32 0-44.8s32-12.8 44.8 0l192 192c12.8 12.8 12.8 32 0 44.8C851.2 864 838.4 864 832 864z"
              p-id="3270"
            />
          </svg>
          <input
            v-model="inputValue"
            class="block search-input"
            type="text"
            @focus="ifShowSearchDropDown = true"
          />
        </div>
        <ul v-if="searchResult.length && ifShowSearchDropDown" class="absolute bg-style drop-down">
          <li
            v-for="item in searchResult"
            :key="item"
            class="cursor-pointer drop-down-item"
            :class="item.goSearch ? 'flex items-center justify-center more-content' : ''"
          >
            <a
              class="drop-down-item-label"
              :href="`/#/?indexPage=${item.indexPage}`"
              @click="
                function (e) {
                  goToDetail(item, e)
                }
              "
            >
              <linkTag class="inline" v-if="item.link" />
              <span>{{ item.name }}</span>
            </a>
          </li>
        </ul>
      </div>
      <commonm-btn @click="search"> 搜索 </commonm-btn>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { debouncedWatch, onClickOutside } from '@vueuse/core'
import { useRouter } from 'vue-router'

import commonmBtn from '@/components/commonm-btn/index.vue'
import linkTag from './link-tag.vue'

export default {
  name: 'components-left-sidebar-search',
  components: {
    commonmBtn,
    linkTag
  },
  props: {
    toggleMenu: {
      type: Function,
      default: () => {}
    }
  },
  setup(props, { emit }) {
    const store = useStore()
    const menuList = computed(() => store.state.menuData.menuList)

    const inputValue = ref('')
    const searchResult = ref([])
    const router = useRouter()
    const target = ref(null)
    const ifShowSearchDropDown = ref(false)

    const goToDetail = (item, e) => {
      e.preventDefault()
      if (item.noResult) return
      if (item.goSearch) return search()
      emit('itemClick', e, item)
    }

    const search = () => {
      props.toggleMenu(false)
      router.push({
        path: '/search',
        query: { key: encodeURI(inputValue.value) ? inputValue.value : '' }
      })
    }

    const menuListCloseAll = () => {
      emit('menuListCloseAll')
    }

    onClickOutside(target, (event) => {
      ifShowSearchDropDown.value = false
    })
    debouncedWatch(
      inputValue,
      () => {
        if (inputValue.value === '') {
          searchResult.value = []
          return
        }
        let limtNum = 10
        const searchArr = []
        const toLowerCaseName = inputValue.value.trim().toLowerCase()
        const filter = (list) => {
          for (let index = 0; index < list.length; index++) {
            if (!limtNum) break

            if (!list[index].children) {
              if (list[index].name.trim().toLowerCase().indexOf(toLowerCaseName) !== -1) {
                limtNum--
                searchArr.push(list[index])
              }
            } else {
              filter(list[index].children)
            }
          }
        }
        filter(menuList.value)
        if (searchArr.length) {
          if (searchArr.length >= 5) {
            searchArr.push({ name: '更多....', goSearch: true })
          }
          searchResult.value = searchArr
        } else {
          searchResult.value = [{ name: '暂无搜索结果', noResult: true }]
        }
      },
      { debounce: 600 }
    )
    return {
      inputValue,
      target,
      searchResult,
      ifShowSearchDropDown,
      goToDetail,
      menuListCloseAll,
      search
    }
  }
}
</script>

<style scoped lang="scss">
.cell {
  padding-left: 30px !important;
}
.drop-down {
  padding: 5px;
  width: calc(100% + 4em);
  border: 1px solid var(--global-border-color);
  border-radius: 5px;
  top: 2em;
  z-index: 1;

  .drop-down-item {
    font-weight: normal;
    font-size: 16px;
    padding: 5px 10px;
    .drop-down-item-label {
      color: var(--global-primary-color);
    }
  }

  .more-content {
    font-size: 14px;
  }
}

.search-input {
  padding: 5px 8px 5px 2.3em;
  width: 140px;
  border-radius: 6000px;
  border: none;
  color: var(--global-text-color);
  outline: 1px solid #454545;
  background-color: var(--global-background-color);
  outline: 1px solid var(--global-border-color);
  &:focus-visible {
    outline: 1px solid var(--global-primary-color);
  }
}

.icon {
  left: 0.4em;
}

.menu-list-close {
  width: 22px;
  height: 25px;
  font-size: 12px;
  font-weight: bolder;
  left: 0;
  border-radius: 0 10px 10px 0;
  background-color: var(--global-primary-color);
  color: var(--global-primary-button-text-color);
}
</style>
