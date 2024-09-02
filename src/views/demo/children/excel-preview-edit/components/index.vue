<template>
  <div class="flex">
    <div class="luckysheet-wrap">
      <div class="relative width100 height100">
        <div id="luckysheet"></div>
      </div>
    </div>
    <div class="flex-1">
      <div class="display-block control-btn">
        <input id="uploadBtn" type="file" @change="loadExcel" />
      </div>
      <div class="display-block control-btn">
        <span style="margin-right: 1em">加载远程文件:</span>
        <select style="margin-right: 1em" v-model="selected" @change="selectExcel">
          <option disabled value="">选择远程文件</option>
          <option v-for="option in options" :key="option.text" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
      <button class="display-block control-btn" @click="downloadExcel">下载当前xlsx</button>
      <button class="display-block control-btn" @click="setCellValue">设置3行4列的数据为69</button>
      <button class="display-block control-btn" @click="setRangeValue">
        设置(第3行-第4行)与(第3列-第4列)交界处的数据
      </button>
      <button class="display-block control-btn" @click="insertImage">设置(5,5)处插入图片</button>
    </div>
    <div v-show="isMaskShow" id="tip">Downloading</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { exportExcel } from './export'
import { isFunction } from '@/common/util/typeCheck'
import LuckyExcel from 'luckyexcel'
import { baseUrlFun } from '@/common/util/methods.js'

defineOptions({ name: 'excel-preview-edit-index' })

const baseUrl = baseUrlFun()

const isMaskShow = ref(false)
const selected = ref('')
const jsonData = ref({})
const avatar = `${baseUrl}demo-static/excel-preview-edit/images/avatar.jpg`
const options = ref([
  {
    text: '01test.xlsx',
    value: `${baseUrl}demo-static/excel-preview-edit/mock-file/01test.xlsx`
  },
  {
    text: '02test.xlsx',
    value: `${baseUrl}demo-static/excel-preview-edit/mock-file/02test.xlsx`
  }
])
// 加载配置sheet
const luckysheetCreate = (exportJson) => {
  window.luckysheet.create({
    container: 'luckysheet', // luckysheet is the container id
    data: exportJson.sheets,
    title: exportJson.info.name,
    plugins: ['chart'],
    lang: 'zh',
    userInfo: exportJson.info.name.creator,
    myFolderUrl: '/'
  })
}
// 卸载组件
const destroyLuckysheet = () => {
  isFunction(window?.luckysheet?.destroy) && window.luckysheet.destroy()
}
const loadExcel = (evt) => {
  const files = evt.target.files
  if (files == null || files.length === 0) {
    alert('未导入文件')
    return
  }

  const name = files[0].name
  const suffixArr = name.split('.')
  const suffix = suffixArr[suffixArr.length - 1]
  if (suffix !== 'xlsx') {
    alert('当前不支持xls以外文件！')
    return
  }
  isMaskShow.value = true
  LuckyExcel.transformExcelToLucky(files[0], function (exportJson, luckysheetfile) {
    if (exportJson.sheets == null || exportJson.sheets.length === 0) {
      alert('无法读取excel文件的内容，当前不支持xls以外文件！')
      return
    }
    console.log('exportJson', exportJson)
    jsonData.value = exportJson

    isMaskShow.value = false

    destroyLuckysheet()

    luckysheetCreate(exportJson)
  })
}
const selectExcel = (evt) => {
  const value = selected.value
  const name = evt.target.options[evt.target.selectedIndex].innerText

  if (value === '') {
    return
  }
  isMaskShow.value = true

  LuckyExcel.transformExcelToLuckyByUrl(value, name, (exportJson, luckysheetfile) => {
    if (exportJson.sheets == null || exportJson.sheets.length === 0) {
      alert('无法读取excel文件的内容，当前不支持xls以外文件！')
      return
    }
    console.log('exportJson', exportJson)
    jsonData.value = exportJson

    isMaskShow.value = false

    destroyLuckysheet()

    luckysheetCreate(exportJson)
  })
}
const downloadExcel = () => {
  // const value = selected.value;;
  //
  // if(value.length==0){
  //     alert("Please select a demo file");
  //     return;
  // }
  //
  // var elemIF = document.getElementById("Lucky-download-frame");
  // if(elemIF==null){
  //     elemIF = document.createElement("iframe");
  //     elemIF.style.display = "none";
  //     elemIF.id = "Lucky-download-frame";
  //     document.body.appendChild(elemIF);
  // }
  // elemIF.src = value;
  console.log('error1')
  exportExcel(window.luckysheet.getAllSheets(), '😡😡excel')
}
const setCellValue = () => {
  if (isFunction(window?.luckysheet?.destroy)) {
    window.luckysheet.setCellValue(4, 5, {
      ct: {
        fa: 'General',
        t: 'g'
      },
      bg: '#ff0',
      fc: '#990000', // 字体颜色为 "#990000"
      m: '69',
      v: 69,
      ps: {
        // 批注
        value: '介是个插入的值' // 批准内容
      }
    })
  }
}
const setRangeValue = () => {
  window.luckysheet.setRangeValue(
    [
      [
        {
          m: 'value1',
          ct: {
            fa: 'General',
            t: 'g'
          },
          v: 'value1'
        },
        {
          m: 'value3',
          ct: {
            fa: 'General',
            t: 'g'
          },
          v: 'value3'
        }
      ],
      [
        {
          m: 'value2',
          ct: {
            fa: 'General',
            t: 'g'
          },
          v: 'value2'
        },
        {
          m: 'value4',
          ct: {
            fa: 'General',
            t: 'g'
          },
          v: 'value4'
        }
      ]
    ],
    {
      range: { row: [3, 4], column: [3, 4] },
      success: () => {
        console.log('插入成功')
      }
    }
  )
}
const insertImage = () => {
  window.luckysheet.insertImage(avatar, {
    order: 0,
    rowIndex: 5,
    colIndex: 5
  })
}

// !!! create luckysheet after mounted
onMounted(() => {
  window.luckysheet.create({
    container: 'luckysheet',
    title: '无内鬼，整点excel文件',
    lang: 'zh',
    column: 26,
    row: 26,
    chart: true,
    myFolderUrl: '/',
    plugins: ['chart'],
    userInfo: {
      userImage: avatar, // 头像url
      userName: '我是黑手哥' // 用户名
    },
    functionButton: '<button class="custom-function-button">高级button插入</button>',
    hook: {
      // cellDragStop: (cell, postion, sheetFile, ctx, event) => {
      //   console.log('cellDragStop', cell, postion, sheetFile, ctx, event)
      // },
      // rowTitleCellRenderBefore: (rowNum, postion, ctx) => {
      //   console.log('rowTitleCellRenderBefore', rowNum, postion, ctx)
      // },
      // rowTitleCellRenderAfter: function (rowNum, postion, ctx) {
      //   console.log('rowTitleCellRenderAfter', rowNum, postion, ctx)
      // },
      // columnTitleCellRenderBefore: (columnAbc, postion, ctx) => {
      //   console.log('columnTitleCellRenderBefore', columnAbc, postion, ctx)
      // },
      // columnTitleCellRenderAfter: (columnAbc, postion, ctx) => {
      //   console.log('columnTitleCellRenderAfter', columnAbc, postion, ctx)
      // },
      // cellRenderBefore: (cell, postion, sheetFile, ctx) => {
      //   console.log('cellRenderBefore', cell, postion, sheetFile, ctx)
      // },
      // cellRenderAfter: (cell, postion, sheetFile, ctx) => {
      //   console.log('cellRenderAfter', cell, postion, sheetFile, ctx)
      // },
      // cellMousedownBefore: function (cell, postion, sheetFile, ctx) {
      //   console.log(postion)
      // },
      // cellMousedown: function (cell, postion, sheetFile, ctx) {
      //   console.log(sheetFile)
      // },
      // sheetMousemove: function (cell, postion, sheetFile, moveState, ctx) {
      //   console.log(cell, postion, sheetFile, moveState, ctx)
      // },
      // sheetMouseup: function (cell, postion, sheetFile, moveState, ctx) {
      //   console.log(cell, postion, sheetFile, moveState, ctx)
      // },
      // cellAllRenderBefore: function (data, sheetFile, ctx) {
      //   console.log(data, sheetFile, ctx)
      // },
      // updated: function (operate) {
      //   console.log(operate)
      // },
      // cellUpdateBefore: function (r, c, value, isRefresh) {
      //   console.log('cellUpdateBefore', r, c, value, isRefresh)
      // },
      // cellUpdated: function (r, c, oldValue, newValue, isRefresh) {
      //   console.log('cellUpdated', r, c, oldValue, newValue, isRefresh)
      // },
      // sheetActivate: function (index, isPivotInitial, isNewSheet) {
      //   console.log(index, isPivotInitial, isNewSheet)
      // },
      // rangeSelect: function (index, sheet) {
      //   console.log(index, sheet)
      // },
      // commentInsertBefore: function (r, c) {
      //   console.log(r, c)
      // },
      // commentInsertAfter: function (r, c, cell) {
      //   console.log(r, c, cell)
      // },
      // commentDeleteBefore: function (r, c, cell) {
      //   console.log(r, c, cell)
      // },
      // commentDeleteAfter: function (r, c, cell) {
      //   console.log(r, c, cell)
      // },
      // commentUpdateBefore: function (r, c, value) {
      //   console.log(r, c, value)
      // },
      // commentUpdateAfter: function (r, c, oldCell, newCell) {
      //   console.log(r, c, oldCell, newCell)
      // },
      // cellEditBefore: function (range) {
      //   console.log(range)
      // },
      workbookCreateAfter: (json) => {
        console.log('表格初始化完成', json)
        $('.luckysheet_info_detail_user').click(() => {
          alert('点点点，点什么点，疯狂拷打你！！！！！！！！！！！')
        })
        $('.custom-function-button').click(() => {
          alert('这仿佛是一个自定义高级button')
        })
      }
      // rangePasteBefore: function (range, data) {
      //   console.log('rangePasteBefore', range, data)
      //   // return false; //Can intercept paste
      // }
    }
  })
})
</script>

<style scoped lang="scss">
.luckysheet-wrap {
  width: 1000px;
  height: 550px;
  border: 1px solid #000;
  padding: 5px;
  margin-right: 40px;

  #luckysheet {
    margin: 0px;
    padding: 0px;
    position: absolute;
    width: 100%;
    left: 0px;
    top: 0;
    bottom: 0px;
  }
}
.control-btn {
  font-size: 14px;
  margin-bottom: 20px;
}

#uploadBtn {
  font-size: 16px;
}

#tip {
  position: absolute;
  z-index: 1000000;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  background: rgba(255, 255, 255, 0.8);
  text-align: center;
  font-size: 40px;
  align-items: center;
  justify-content: center;
  display: flex;
}
</style>
