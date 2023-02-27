<script>
import { reactive, ref, markRaw } from 'vue'
export default {
  props: {
    tabsList: {
      type: Array,
      default: () => ([])
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  setup (props, { slots }) {
    const slotList = reactive([])
    const currentIndex = ref(props.activeIndex)

    slots.default().forEach((item, index) => {
      slotList.push({
        ifShow: currentIndex.value === index,
        ifRender: currentIndex.value === index,
        component: markRaw(item)
      })
    })
    return {
      currentIndex,
      slotList
    }
  },
  render () {
    return (
      <div class="flex flex-direction-column height100">
        <div class="flex tabs">
          {
            this.tabsList.map((item, index) => {
              return (
                <div
                  class="cursor-pointer tabs-item"
                  style={{
                    borderRight: '1px solid #000',
                    ...(index === 0 ? { borderLeft: '1px solid #000' } : {}),
                    ...(this.currentIndex === index ? { color: 'green', fontWeight: 'bolder' } : {})
                  }}
                  onClick={() => {
                    this.slotList[index].ifRender = true
                    this.currentIndex = index
                    this.slotList.forEach((item, slotItemIndex) => {
                      item.ifShow = slotItemIndex === this.currentIndex
                    })
                  }} key={index}>{item.title}</div>
              )
            })
          }
        </div>
        <div class='overflow-auto flex1'>
          <div>
            { this.slotList.map(item => {
              const itemComponent = item.component
              if (item.ifRender) {
                return <itemComponent style={item.ifShow ? {} : { display: 'none' }}></itemComponent>
              }
              return null
            }) }
          </div>
        </div>
      </div>
    )
  }

}
</script>

<style lang="scss" scoped>
.tabs{
  border-bottom: 1px solid #000;
  padding: 0 0 0 20px;
  .tabs-item{
    padding: 10px 30px;
  }
}
</style>
