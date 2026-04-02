<script lang="jsx">
import { ref } from 'vue'
import commonBtn from '@/components/common-btn/index.vue'
import axios from '@/common/axios/index.js'

export default {
  name: 'components-notice',
  components: {
    commonBtn
  },
  props: {
    showPopup: {
      type: Boolean,
      default: false
    },
    ifLarger: {
      type: Boolean,
      default: true
    }
  },
  setup(props, { emit }) {
    const notice = ref([])
    const noticeTitle = ref('')
    const loading = ref('loading') // 'loading' 'error' 'done'

    const getNotice = () => {
      loading.value = 'loading'
      axios
        .get('./changed/changed-files.json')
        .then((res) => {
          console.log('myComponent-success', res.data)
          notice.value = res.data.changedFiles
          noticeTitle.value = `${res.data.currentDate}更新${res.data.count}条`
          loading.value = 'done'

          // notice.value = []
          // noticeTitle.value = '加载错误'
          // loading.value = 'error'
        })
        .catch((err) => {
          console.log('myComponent-err', err)
          notice.value = []
          noticeTitle.value = '加载错误'
          loading.value = 'error'
        })
    }

    getNotice()

    return {
      loading,
      notice,
      noticeTitle,
      getNotice,
      handelClick: (e) => {
        e.stopPropagation()
        emit('update:showPopup', !props.showPopup)
      }
    }
  },
  render() {
    return (
      <>
        {
          /* 弹出层 */
          this.showPopup ? (
            <>
              <div
                vLoading={this.loading === 'loading'}
                onClick={this.handelClick}
                class={`absolute popup ${this.ifLarger ? 'popup-pc' : 'popup-phone'}`}
              >
                <div class="popup-inner flex flex-col">
                  <p class="title flex items-center justify-center">{this.noticeTitle}</p>

                  {this.loading === 'error' ? (
                    <div class="cell flex items-center justify-center">
                      <common-btn
                        class="close-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          this.getNotice()
                        }}
                      >
                        刷新
                      </common-btn>
                    </div>
                  ) : null}

                  <p class="cell">如有疑问联系我QQ:1392558812</p>

                  {this.notice.map((item, index) => (
                    <p key={index} class="cell">
                      {index + 1}.{item}
                    </p>
                  ))}
                </div>
              </div>
              <div class="mask" onClick={this.handelClick}></div>
            </>
          ) : null
        }
      </>
    )
  }
}
</script>

<style scoped lang="scss">
.popup-pc {
  right: 20px;
  padding: 10px 0;
  top: calc(100% + 15px);
  max-height: 300px;
  width: 400px;
  overflow: auto;
  z-index: 1000;
  &::after {
    display: block;
    content: '';
    position: absolute;
    width: 17px;
    height: 17px;
    top: 0;
    transform: translate(-40px, -50%) rotate(45deg);
    right: 0;
    background-color: var(--global-background-color);
    border-top: 1px solid var(--global-border-color);
    border-left: 1px solid var(--global-border-color);
    z-index: 1;
  }
}

.popup-phone {
  position: fixed;
  width: 90vw;
  max-height: 60vh;
  top: 50%;
  left: 50%;
  z-index: 10;
  transform: translate(-50%, -50%);
  overflow: auto;
  z-index: 1000;
}

.popup {
  background-color: var(--global-background-color);
  color: var(--global-text-color);
  border: 1px solid var(--global-border-color);
  border-radius: 5px;
  .popup-inner {
    position: relative;
    line-height: 1;
    padding: 0 10px;
    z-index: 10;
    .title {
      line-height: 1;
      padding: 15px 20px;
      font-weight: 600;
      margin: 0;
      border-bottom: 1px solid var(--global-border-color);
      white-space: nowrap;
    }
    .cell {
      padding: 10px 15px;
      width: auto;
      word-break: break-all;
      margin: 0;
    }
  }
}

.mask {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
