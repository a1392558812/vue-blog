<template>
  <div class="h-[100vh] flex overflow-hidden relative">
    <div
      class="p-[30px] w-[400px] h-[calc(100%-60px)] shrink-0 overflow-auto bg-[#fff] flex flex-wrap gap-[20px] items-center"
    >
      <div class="shrink-0" v-for="(item, index) in editConfig.commandList" :key="index">
        <template v-if="item.component === 'button'">
          <button @click="item.callback" :key="index">{{ item.name }}</button>
        </template>

        <template v-if="item.component === 'select'">
          <div>
            {{ item.name }}:
            <select @change="item.callback">
              <div class="relative z-[20]" v-if="item.component === 'select'">
                <option
                  v-for="(option, optionIndex) in item.options"
                  :key="`${index}-${optionIndex}`"
                  :value="option.value"
                >
                  {{ option.name }}
                </option>
              </div>
            </select>
          </div>
        </template>

        <template v-if="item.component === 'picker'">
          <div class="flex items-center">
            {{ item.name }}:
            <input type="color" @input="item.callback" />
          </div>
        </template>
      </div>
      <div class="shrink-0">
        插入文档(.docx)
        <input
          type="file"
          name="file-docx"
          :ref="
            (ref) => {
              editConfig.fileUpload.docx.ref = ref
            }
          "
          id=""
          :value="editConfig.fileUpload.docx.files"
          @change="editConfig.fileUpload.docx.onChange"
          accept=".docx"
        />
      </div>

      <div class="shrink-0">
        插入文档(.xlsx)
        <input
          type="file"
          name="file-excel"
          :ref="
            (ref) => {
              editConfig.fileUpload.excel.ref = ref
            }
          "
          :value="editConfig.fileUpload.excel.files"
          id=""
          @change="editConfig.fileUpload.excel.onChange"
          accept=".xlsx"
        />
      </div>
    </div>
    <div class="canvas-editor shrink-0 p-[30px] w-[794px] h-[calc(100%-60px)] overflow-auto">
      <div ref="canvasEditorRef" class=""></div>
    </div>
    <div class="comment shrink-0 flex-1 p-[30px] h-[calc(100%-60px)] overflow-auto">
      <div
        class="comment-item mb-[10px] p-[10px] border border-[#ccc] rounded-[5px] cursor-pointer"
        v-for="(item, index) in commentList"
        :key="index"
        :data-id="item.id"
        @click="onCommentListItemClick(item.id)"
      >
        <div class="comment-item__title">{{ item.rangeText }}</div>
        <div class="comment-item__info">{{ item.createdDate }}</div>
        <div class="comment-item__info">{{ item.userName }}</div>
        <div class="comment-item__content">{{ item.content }}</div>
      </div>
    </div>
  </div>
</template>
<script setup lang="jsx">
import { ref, nextTick, reactive, onUnmounted } from 'vue'

import barcode1dPlugin from '@hufe921/canvas-editor-plugin-barcode1d'
import barcode2dPlugin from '@hufe921/canvas-editor-plugin-barcode2d'
import codeblockPlugin from '@hufe921/canvas-editor-plugin-codeblock'
import docxPlugin from '@hufe921/canvas-editor-plugin-docx'
import excelPlugin from '@hufe921/canvas-editor-plugin-excel'
import floatingToolbarPlugin from '@hufe921/canvas-editor-plugin-floating-toolbar'
import diagramPlugin from '@hufe921/canvas-editor-plugin-diagram'
import casePlugin from '@hufe921/canvas-editor-plugin-case'

import Editor, {
  EditorZone,
  ElementType,
  EditorMode,
  RowFlex,
  VerticalAlign,
  TableBorder,
  TdBorder,
  TdSlash,
  ImageDisplay,
  PaperDirection
} from '@hufe921/canvas-editor'

import { data, commentList as list, options } from './mock.js'
import { fileToBase64Async } from '@/common/util/methods'
import dialog from '@/components/dialog/index'

defineOptions({
  name: 'canvas-editor'
})

const canvasEditorRef = ref(null)

const fileChangeCallback = (e) => {
  return new Promise((resolve, reject) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onload = (event) => {
      const buffer = event?.target?.result
      if (buffer instanceof ArrayBuffer) {
        resolve(buffer)
      } else {
        reject(new Error('文件读取失败'))
      }
    }
  })
}

const editConfig = reactive({
  mode: EditorMode.EDIT, // 编辑模式
  fileUpload: {
    docx: {
      ref: null,
      files: [],
      onChange: (e) => {
        fileChangeCallback(e).then((buffer) => {
          instance.command.executeImportDocx({
            arrayBuffer: buffer
          })
          editConfig.fileUpload.docx.files = []
        })
      }
    },
    excel: {
      ref: null,
      files: [],
      onChange: (e) => {
        fileChangeCallback(e).then((buffer) => {
          instance.command.executeImportExcel({
            arrayBuffer: buffer
          })
          editConfig.fileUpload.excel.files = []
        })
      }
    }
  },
  commandList: [],
  eventList: [
    {
      eventType: 'rangeStyleChange',
      callback: (payload) => {
        console.log('rangeStyleChange', payload)
      }
    },
    {
      eventType: 'visiblePageNoListChange',
      callback: (payload) => {
        console.log('visiblePageNoListChange', payload)
      }
    },
    {
      eventType: 'intersectionPageNoChange',
      callback: (payload) => {
        console.log('intersectionPageNoChange', payload)
      }
    },
    {
      eventType: 'pageSizeChange',
      callback: (payload) => {
        console.log('pageSizeChange', payload)
      }
    },
    {
      eventType: 'pageScaleChange',
      callback: (payload) => {
        console.log('pageScaleChange', payload)
      }
    },
    {
      eventType: 'contentChange',
      callback: () => {
        console.log('contentChange')
      }
    },
    {
      eventType: 'controlChange',
      callback: (payload) => {
        console.log('controlChange', payload)
      }
    },
    {
      eventType: 'controlContentChange',
      callback: (payload) => {
        console.log('controlContentChange', payload)
      }
    },
    {
      eventType: 'pageModeChange',
      callback: (payload) => {
        console.log('pageModeChange', payload)
      }
    },
    {
      eventType: 'saved',
      callback: (payload) => {
        console.log('saved', payload)
      }
    },
    {
      eventType: 'zoneChange',
      callback: (payload) => {
        console.log('zoneChange', payload)
      }
    },
    {
      eventType: 'mousemove',
      callback: (evt) => {
        //console.log('mousemove', evt)
      }
    },
    {
      eventType: 'mouseenter',
      callback: (evt) => {
        // console.log('mouseenter', evt)
      }
    },
    {
      eventType: 'mouseleave',
      callback: (evt) => {
        //console.log('mouseleave', evt)
      }
    },
    {
      eventType: 'mousedown',
      callback: (evt) => {
        //console.log('mousedown', evt)
      }
    },
    {
      eventType: 'mouseup',
      callback: (evt) => {
        //console.log('mouseup', evt)
      }
    },
    {
      eventType: 'click',
      callback: (evt) => {
        //console.log('click', evt)
      }
    },
    {
      eventType: 'positionContextChange',
      callback: (payload) => {
        console.log('positionContextChange', payload)
      }
    },
    {
      eventType: 'imageSizeChange',
      callback: (payload) => {
        console.log('imageSizeChange', payload)
      }
    }
  ]
})

const commentList = ref(list)

let instance = null

const initEditBtnList = () => {
  if (!instance) return
  editConfig.commandList = [
    {
      name: '编辑模式',
      component: 'select',
      options: [
        { value: EditorMode.EDIT, name: '编辑模式' },
        {
          value: EditorMode.CLEAN,
          name: '清洁模式'
        },
        {
          value: EditorMode.READONLY,
          name: '只读模式'
        },
        {
          value: EditorMode.FORM,
          name: '表单模式'
        },
        {
          value: EditorMode.PRINT,
          name: '打印模式'
        },
        {
          value: EditorMode.DESIGN,
          name: '设计模式'
        }
      ],
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeMode(e.target.value)
      }
    },
    {
      name: '全选',
      component: 'button',
      callback: () => {
        instance.command.executeSelectAll()
      }
    },
    {
      name: '向前删除',
      component: 'button',
      callback: () => {
        instance.command.executeBackspace()
      }
    },
    {
      name: '撤回',
      component: 'button',
      callback: () => {
        instance.command.executeUndo()
      }
    },
    {
      name: '撤回上次的撤回',
      component: 'button',
      callback: () => {
        instance.command.executeRedo()
      }
    },
    {
      name: '格式刷-复制样式',
      component: 'button',
      callback: () => {
        instance.command.executePainter({
          isDblclick: false
        })
      }
    },
    {
      name: '清除样式',
      component: 'button',
      callback: () => {
        instance.command.executeFormat()
      }
    },
    {
      name: '设置字体',
      component: 'select',
      options: [
        { name: 'Microsoft YaHei', value: 'Microsoft YaHei' },
        { name: '华文宋体', value: '华文宋体' },
        { name: '华文黑体', value: '华文黑体' },
        { name: '华文仿宋', value: '华文仿宋' },
        { name: '华文楷体', value: '华文楷体' },
        { name: '华文琥珀', value: '华文琥珀' },
        { name: '华文楷体', value: '华文楷体' },
        { name: '华文隶书', value: '华文隶书' },
        { name: '华文新魏', value: '华文新魏' },
        { name: '华文行楷', value: '华文行楷' },
        { name: '华文中宋', value: '华文中宋' },
        { name: '华文彩云', value: '华文彩云' },
        { name: 'Arial', value: 'Arial' },
        { name: 'Segoe UI', value: 'Segoe UI' },
        { name: 'Ink Free', value: 'Ink Free' },
        { name: 'Fantasy', value: 'Fantasy' }
      ],
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeFont(e.target.value)
      }
    },
    {
      name: '设置字号',
      component: 'select',
      options: (() => {
        const arr = []
        for (let i = 1; i < 100; i++) {
          arr.push({ name: i, value: i })
        }
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeSize(+e.target.value)
      }
    },
    {
      name: '增大字号+',
      component: 'button',
      callback: (e) => {
        instance.command.executeSizeAdd()
      }
    },
    {
      name: '减小字号-',
      component: 'button',
      callback: (e) => {
        instance.command.executeSizeMinus()
      }
    },
    {
      name: '字体加粗',
      component: 'button',
      callback: (e) => {
        instance.command.executeBold()
      }
    },
    {
      name: '字体斜体',
      component: 'button',
      callback: (e) => {
        instance.command.executeItalic()
      }
    },
    {
      name: '下划线',
      component: 'button',
      callback: (e) => {
        instance.command.executeUnderline()
      }
    },
    {
      name: '删除线',
      component: 'button',
      callback: (e) => {
        instance.command.executeStrikeout()
      }
    },
    {
      name: '上标',
      component: 'button',
      callback: (e) => {
        instance.command.executeSuperscript()
      }
    },
    {
      name: '下标',
      component: 'button',
      callback: (e) => {
        instance.command.executeSubscript()
      }
    },
    {
      name: '字体颜色',
      component: 'picker',
      callback: (e) => {
        instance.command.executeColor(e.target.value)
      }
    },
    {
      name: '高亮',
      component: 'picker',
      callback: (e) => {
        instance.command.executeHighlight(e.target.value)
      }
    },
    {
      name: '标题设置',
      component: 'select',
      options: [
        { name: '没有标题', value: '' },
        { name: '一级标题', value: 'first' },
        { name: '二级标题', value: 'second' },
        { name: '三级标题', value: 'third' },
        { name: '四级标题', value: 'fourth' },
        { name: '五级标题', value: 'fifth' },
        { name: '六级标题', value: 'sixth' }
      ],
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeTitle(e.target.value)
      }
    },
    {
      name: '列表设置',
      component: 'select',
      options: [
        { name: 'decimal', value: 'ol-decimal' },
        { name: 'checkbox', value: 'ul-checkbox' },
        { name: 'disc', value: 'ul-disc' },
        { name: 'circle', value: 'ul-circle' },
        { name: 'square', value: 'ul-square' }
      ],
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        const paramsArr = e.target.value.split('-')
        instance.command.executeList(paramsArr[0], paramsArr[1])
      }
    },
    {
      name: '行对齐',
      component: 'select',
      options: (() => {
        const arr = []
        Object.keys(RowFlex).forEach((key) => {
          arr.push({ name: key, value: RowFlex[key] })
        })
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeRowFlex(e.target.value)
      }
    },
    {
      name: '行间距',
      component: 'select',
      options: (() => {
        const arr = []
        for (let i = 0.5; i < 20; i = i + 0.5) {
          arr.push({ name: i, value: i })
        }
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeRowMargin(+e.target.value)
      }
    },
    {
      name: '插入表格',
      component: 'button',
      callback: (e) => {
        let row = 3
        let col = 3
        dialog({
          title: '批注',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                行
                <input
                  value={row}
                  onInput={(e) => {
                    row = +(+e.target.value).toFixed(0)
                    row = row <= 0 ? 1 : row
                    console.log('row', row)
                  }}
                  class="ml-[10px]"
                  type="number"
                />
              </div>
              <div>
                列
                <input
                  value={col}
                  onInput={(e) => {
                    col = +(+e.target.value).toFixed(0)
                    col = col <= 0 ? 1 : col
                    console.log('col', col)
                  }}
                  class="ml-[10px]"
                  type="number"
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            console.log('confirm', row, col)
            instance.command.executeInsertTable(row, col)
            close()
          }
        })
      }
    },
    {
      name: '向当前表格row上插入一行',
      component: 'button',
      callback: (e) => {
        instance.command.executeInsertTableTopRow()
      }
    },
    {
      name: '向当前表格row下插入一行',
      component: 'button',
      callback: (e) => {
        instance.command.executeInsertTableBottomRow()
      }
    },
    {
      name: '向当前表格col左插入一列',
      component: 'button',
      callback: (e) => {
        instance.command.executeInsertTableLeftCol()
      }
    },
    {
      name: '向当前表格col右插入一列',
      component: 'button',
      callback: (e) => {
        instance.command.executeInsertTableRightCol()
      }
    },
    {
      name: '删除当前行',
      component: 'button',
      callback: (e) => {
        instance.command.executeDeleteTableRow()
      }
    },
    {
      name: '删除当前列',
      component: 'button',
      callback: (e) => {
        instance.command.executeDeleteTableCol()
      }
    },
    {
      name: '删除表格',
      component: 'button',
      callback: (e) => {
        instance.command.executeDeleteTable()
      }
    },
    {
      name: '合并表格',
      component: 'button',
      callback: (e) => {
        instance.command.executeMergeTableCell()
      }
    },
    {
      name: '取消合并表格',
      component: 'button',
      callback: (e) => {
        instance.command.executeCancelMergeTableCell()
      }
    },
    {
      name: '分隔当前单元格（垂直方向）',
      component: 'button',
      callback: (e) => {
        instance.command.executeSplitVerticalTableCell()
      }
    },
    {
      name: '分隔当前单元格（水平方向）',
      component: 'button',
      callback: (e) => {
        instance.command.executeSplitHorizontalTableCell()
      }
    },
    {
      name: '表格单元格垂直对齐方式',
      component: 'select',
      options: (() => {
        const arr = []
        Object.keys(VerticalAlign).forEach((key) => {
          arr.push({ name: key, value: VerticalAlign[key] })
        })
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeTableTdVerticalAlign(e.target.value)
      }
    },
    {
      name: '表格边框类型',
      component: 'select',
      options: (() => {
        const arr = []
        Object.keys(TableBorder).forEach((key) => {
          arr.push({ name: key, value: TableBorder[key] })
        })
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeTableBorderType(e.target.value)
      }
    },
    {
      name: '表格边框颜色',
      component: 'picker',
      callback: (e) => {
        instance.command.executeTableBorderColor(e.target.value)
      }
    },
    {
      name: '表格单元格边框类型',
      component: 'select',
      options: (() => {
        const arr = []
        Object.keys(TdBorder).forEach((key) => {
          arr.push({ name: key, value: TdBorder[key] })
        })
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeTableTdBorderType(e.target.value)
      }
    },
    {
      name: '表格单元格内斜线',
      component: 'select',
      options: (() => {
        const arr = []
        Object.keys(TdSlash).forEach((key) => {
          arr.push({ name: key, value: TdSlash[key] })
        })
        return arr
      })(),
      callback: (e) => {
        console.log('e.target.value', e.target.value)
        instance.command.executeTableTdSlashType(e.target.value)
      }
    },
    {
      name: '表格单元格背景色',
      component: 'picker',
      callback: (e) => {
        instance.command.executeTableTdBackgroundColor(e.target.value)
      }
    },
    {
      name: '选中整个表格',
      component: 'button',
      callback: (e) => {
        instance.command.executeTableSelectAll()
      }
    },
    {
      name: '插入图片',
      component: 'button',
      callback: (e) => {
        let imageData = {
          value: '',
          width: 150,
          height: 150,
          imgDisplay: ImageDisplay.INLINE
        }
        dialog({
          title: '插入图片',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>插入对齐方式</div>
                <select
                  onChange={() => {
                    imageData.imgDisplay = event.target.value
                  }}
                >
                  {Object.keys(ImageDisplay).map((key) => {
                    return (
                      <option key={key} value={ImageDisplay[key]}>
                        {key}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <div>插入图片</div>
                <input
                  class="w-full shrink-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    console.log('e.target.value', event.target.files)
                    for (let i = 0; i < event.target.files.length; i++) {
                      fileToBase64Async(event.target.files[i]).then((value) => {
                        const img = new Image()
                        img.src = value
                        img.onload = (e) => {
                          imageData.width = 150
                          imageData.height = 150 * (img.height / img.width)
                          imageData.value = value
                        }
                      })
                    }
                  }}
                  placeholder="插入图片"
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeImage(imageData)
            close()
          }
        })
      }
    },
    {
      name: '插入链接',
      component: 'button',
      callback: (e) => {
        let inputValue = 'https://awen-blog.netlify.app/'
        let name = 'Awen的博客'
        dialog({
          title: '插入链接',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>插入文本</div>
                <input
                  class="w-full shrink-0"
                  value={name}
                  onInput={(e) => {
                    name = e.target.value
                  }}
                  placeholder="插入文本"
                />
              </div>
              <div>
                <div>插入链接</div>
                <input
                  class="w-full shrink-0"
                  value={inputValue}
                  onInput={(e) => {
                    inputValue = e.target.value
                  }}
                  placeholder="插入链接"
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeHyperlink({
              type: ElementType.HYPERLINK,
              value: '',
              url: inputValue,
              valueList: name.split('').map((item) => {
                return {
                  value: item,
                  size: 16
                }
              })
            })
            close()
          }
        })
      }
    },
    {
      name: '删除链接',
      component: 'button',
      callback: (e) => {
        instance.command.executeDeleteHyperlink()
      }
    },
    {
      name: '取消链接',
      component: 'button',
      callback: (e) => {
        instance.command.executeCancelHyperlink()
      }
    },
    {
      name: '编辑链接',
      component: 'button',
      callback: (e) => {
        let inputValue = 'https://awen-blog.netlify.app/'
        const range = instance.command.getRangeContext()
        if (range && range.startElement && range.startElement.type === ElementType.HYPERLINK) {
          inputValue = range.startElement.url
        }
        console.log('range', range)
        dialog({
          title: '编辑链接',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div>
                <div>编辑链接</div>
                <div>如若编辑没生效，将光标置于超链接后再点击编辑按钮</div>
                <input
                  class="w-full shrink-0"
                  value={inputValue}
                  onInput={(e) => {
                    inputValue = e.target.value
                  }}
                  placeholder="编辑链接"
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeEditHyperlink(inputValue)
            close()
          }
        })
      }
    },
    {
      name: '插入分割线',
      component: 'button',
      callback: (e) => {
        let numStr = ''
        dialog({
          title: '插入分割线',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>插入分割线(分割线线段以英文逗号分割，奇数位是实线，偶数位是虚线)</div>
                <select
                  onChange={(event) => {
                    numStr = event.target.value
                  }}
                >
                  {[
                    { name: '3,1', value: '3,1' },
                    { name: '1,3', value: '1,3' },
                    { name: '3,3', value: '3,3' }
                  ].map((item) => {
                    return (
                      <option key={item.name} value={item.value}>
                        {item.name}
                      </option>
                    )
                  })}
                </select>
              </div>
              <div>
                <div>自己输入</div>
                <input
                  class="w-full shrink-0"
                  onInput={(event) => {
                    numStr = event.target.value
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            let arr = []
            try {
              arr = numStr.split(',').map((item) => +item)
            } catch (e) {
              arr = [0, 0]
            }
            instance.command.executeSeparator(arr)
            close()
          }
        })
      }
    },
    {
      name: '分页符',
      component: 'button',
      callback: (e) => {
        instance.command.executePageBreak()
      }
    },
    {
      name: '添加水印',
      component: 'button',
      callback: (e) => {
        let watermarkData = {
          data: 'test水印',
          color: '',
          size: 16,
          opacity: 100,
          repeat: true,
          gap: [0, 0]
        }
        dialog({
          title: '添加水印',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>内容</div>
                <input
                  class="w-full shrink-0"
                  value={watermarkData.data}
                  onInput={(event) => {
                    watermarkData.data = event.target.value
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>颜色</div>
                <input
                  class="w-full shrink-0"
                  type="color"
                  value={watermarkData.color}
                  onInput={(event) => {
                    watermarkData.color = event.target.value
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>字体大小</div>
                <input
                  class="w-full shrink-0"
                  value={watermarkData.size}
                  onInput={(event) => {
                    const num = +event.target.value
                    watermarkData.size = num > 0 ? num : 0
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>透明度</div>
                <input
                  class="w-full shrink-0"
                  value={watermarkData.opacity}
                  onInput={(event) => {
                    const num = +event.target.value
                    watermarkData.opacity = num > 100 ? 100 : num < 0 ? 0 : num
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>是否重复</div>
                <select
                  onChange={(event) => {
                    watermarkData.repeat = !!+event.target.value
                  }}
                >
                  <option value="1">是</option>
                  <option value="0">否</option>
                </select>
              </div>

              <div class="mb-[10px]">
                <div>水平间隔</div>
                <input
                  class="w-full shrink-0"
                  value={watermarkData.gap[0]}
                  onInput={(event) => {
                    const num = +event.target.value
                    watermarkData.gap[0] = num < 0 ? 0 : num
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>垂直间隔</div>
                <input
                  class="w-full shrink-0"
                  value={watermarkData.gap[1]}
                  onInput={(event) => {
                    const num = +event.target.value
                    watermarkData.gap[1] = num > 0 ? num : 0
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            console.log('confirm', watermarkData)
            instance.command.executeAddWatermark(watermarkData)
            close()
          }
        })
      }
    },
    {
      name: '删除水印',
      component: 'button',
      callback: (e) => {
        instance.command.executeDeleteWatermark()
      }
    },
    {
      name: '搜索',
      component: 'button',
      callback: (e) => {
        let search = ''
        dialog({
          title: '搜索',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>搜索内容</div>
                <input
                  class="w-full shrink-0"
                  value={search}
                  onInput={(event) => {
                    search = event.target.value
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeSearch(search)
            close()
          }
        })
      }
    },
    {
      name: '搜索内容上一个',
      component: 'button',
      callback: (e) => {
        instance.command.executeSearchNavigatePre()
      }
    },
    {
      name: '搜索内容下一个',
      component: 'button',
      callback: (e) => {
        instance.command.executeSearchNavigateNext()
      }
    },
    {
      name: '替换当前搜索的内容',
      component: 'button',
      callback: (e) => {
        let newSearch = ''
        dialog({
          title: '替换当前搜索的内容',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>替换当前搜索的内容</div>
                <input
                  class="w-full shrink-0"
                  value={newSearch}
                  onInput={(event) => {
                    newSearch = event.target.value
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeReplace(newSearch)
            close()
          }
        })
      }
    },
    {
      name: '打印',
      component: 'button',
      callback: (e) => {
        instance.command.executePrint()
      }
    },
    {
      name: '设置缩放比例',
      component: 'button',
      callback: (e) => {
        let val = ''
        dialog({
          title: '设置缩放比例',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>设置缩放比例(0-100)</div>
                <input
                  class="w-full shrink-0"
                  type="number"
                  value={val}
                  onInput={(event) => {
                    val = event.target.value
                  }}
                  val
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executePageScale(+val > 0 ? +val / 100 : 1)
            close()
          }
        })
      }
    },
    {
      name: '恢复页面原始缩放比例',
      component: 'button',
      callback: (e) => {
        instance.command.executePageScaleRecovery()
      }
    },
    {
      name: '页面缩小',
      component: 'button',
      callback: (e) => {
        instance.command.executePageScaleMinus()
      }
    },
    {
      name: '页面放大',
      component: 'button',
      callback: (e) => {
        instance.command.executePageScaleAdd()
      }
    },
    {
      name: '设置纸张',
      component: 'button',
      callback: (e) => {
        let pageData = {
          width: 100,
          height: 100,
          paperDirection: PaperDirection.HORIZONTAL,
          paperMargin: [10, 10, 10, 10]
        }
        dialog({
          title: '设置缩放比例',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>宽</div>
                <input
                  class="w-full shrink-0"
                  type="number"
                  value={pageData.width}
                  onInput={(event) => {
                    let width = +event.target.value
                    width = width > 0 ? width : 10
                    pageData.width = width
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>高</div>
                <input
                  class="w-full shrink-0"
                  type="number"
                  value={pageData.height}
                  onInput={(event) => {
                    let height = +event.target.value
                    height = height > 0 ? height : 10
                    pageData.height = height
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>纸张方向</div>
                <select
                  onChange={(event) => {
                    pageData.paperDirection = event.target.value
                  }}
                >
                  {Object.keys(PaperDirection).map((key) => {
                    return (
                      <option key={key} value={PaperDirection[key]}>
                        {key}
                      </option>
                    )
                  })}
                </select>
                {['上边距', '下边距', '左边距', '右边距'].map((item, index) => {
                  return (
                    <div class="mb-[10px]" key={item}>
                      <div>{item}</div>
                      <input
                        class="w-full shrink-0"
                        type="number"
                        value={pageData.paperMargin[index]}
                        onInput={(event) => {
                          let val = +event.target.value
                          val = val > 0 ? val : 10
                          pageData.paperMargin[index] = val
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executePaperSize(pageData.width, pageData.height)
            instance.command.executePaperDirection(pageData.paperDirection)
            instance.command.executeSetPaperMargin(pageData.paperMargin)
            close()
          }
        })
      }
    },
    {
      name: '设置正文徽章',
      component: 'button',
      callback: (e) => {
        let formData = {
          width: 150,
          height: 150,
          value: '',
          top: 0,
          left: 0
        }
        dialog({
          title: '插入图片',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>top</div>
                <input
                  class="w-full shrink-0"
                  type="number"
                  value={formData.top}
                  onInput={(event) => {
                    let top = +event.target.value
                    top = top > 0 ? top : 0
                    formData.top = top
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>left</div>
                <input
                  class="w-full shrink-0"
                  type="number"
                  value={formData.left}
                  onInput={(event) => {
                    let left = +event.target.value
                    left = left > 0 ? left : 0
                    formData.left = left
                  }}
                />
              </div>

              <div>
                <div>插入图片</div>
                <input
                  class="w-full shrink-0"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    console.log('e.target.value', event.target.files)
                    for (let i = 0; i < event.target.files.length; i++) {
                      fileToBase64Async(event.target.files[i]).then((value) => {
                        const img = new Image()
                        img.src = value
                        img.onload = (e) => {
                          formData.width = 150
                          formData.height = 150 * (img.height / img.width)
                          formData.value = value
                        }
                      })
                    }
                  }}
                  placeholder="插入图片"
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeSetMainBadge(formData)
            close()
          }
        })
      }
    },
    {
      name: '文字工具（删除空行、行首空格）',
      component: 'button',
      callback: (e) => {
        instance.command.executeWordTool()
      }
    },
    {
      name: '设置编辑器 HTML 数据',
      component: 'button',
      callback: (e) => {
        let formData = {
          header: '<h1>header11</h1>',
          main: '<h1>main11</h1>',
          footer: '<h1>foote11r</h1>'
        }
        dialog({
          title: '设置编辑器',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <div class="mb-[10px]">
                <div>header</div>
                <textarea
                  class="w-full shrink-0"
                  type="number"
                  value={formData.header}
                  onInput={(event) => {
                    formData.header = event.target.value
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>main</div>
                <textarea
                  class="w-full shrink-0"
                  type="number"
                  value={formData.main}
                  onInput={(event) => {
                    formData.main = event.target.value
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>footer</div>
                <textarea
                  class="w-full shrink-0"
                  value={formData.footer}
                  onInput={(event) => {
                    formData.footer = event.target.value
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            console.log('confirm', formData)
            instance.command.executeSetHTML(formData)
            close()
          }
        })
      }
    },
    {
      name: '获取当前文档信息',
      component: 'button',
      callback: (e) => {
        instance.command.getValueAsync().then((value) => {
          console.log('获取当前文档信息', value)
          const result = JSON.stringify(value)
          dialog({
            title: '获取当前文档信息',
            contentContent: <div class="w-full flex-1 overflow-auto shrink-0">{result}</div>
          })
        })
      }
    },
    {
      name: '插入公式',
      component: 'button',
      callback: (e) => {
        let formData = {
          name: '老公式',
          value: 'Awen = Mc2'
        }
        dialog({
          title: '插入公式',
          contentContent: (
            <div class="w-full flex-1 overflow-auto shrink-0">
              <div class="mb-[10px]">
                <div>老公式名称</div>
                <textarea
                  class="w-full shrink-0"
                  value={formData.name}
                  onInput={(event) => {
                    formData.name = event.target.value
                  }}
                />
              </div>

              <div class="mb-[10px]">
                <div>老公式</div>
                <textarea
                  class="w-full shrink-0"
                  value={formData.value}
                  onInput={(event) => {
                    formData.value = event.target.value
                  }}
                />
              </div>
            </div>
          ),
          confirm: (close) => {
            instance.command.executeInsertElementList([
              {
                value: formData.name
              },
              {
                value: formData.value,
                type: ElementType.LATEX
              },
              {
                value: '\n'
              }
            ])
            close()
          }
        })
      }
    }
  ]
}

const onCommentListItemClick = (id) => {
  instance.command.getGroupIds().then((groupIds) => {
    if (groupIds.includes(id)) {
      instance.command.executeLocationGroup(id)
    } else {
      instance.command.executeDeleteGroup(id)
    }
  })
}

const contextMenuList = () => {
  if (!instance) return
  instance.register.contextMenuList([
    {
      name: '批注',
      when: (payload) => {
        return !payload.isReadonly && payload.editorHasSelection && payload.zone === EditorZone.MAIN
      },
      callback: (command) => {
        let annotations = ''
        dialog({
          title: '批注',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <textarea
                class="w-[calc(100%-40px)] h-[calc(100%-40px)] shrink-0 p-[20px] border border-[#ccc] rounded-[5px]"
                value={annotations}
                onInput={(e) => {
                  annotations = e.target.value
                }}
                placeholder="请输入批注"
              />
            </div>
          ),
          confirm: (close) => {
            if (!annotations) return
            const groupId = command.executeSetGroup()
            console.log('confirm', annotations, groupId)
            if (!groupId) return
            commentList.value.push({
              id: groupId,
              content: annotations,
              userName: 'Awen',
              rangeText: command.getRangeText(),
              createdDate: new Date().toLocaleString()
            })
            close()
          }
        })
      }
    },
    {
      name: '签名',
      icon: 'signature',
      when: (payload) => {
        return !payload.isReadonly && payload.editorTextFocus
      },
      callback: (command) => {
        let dialogInstance = dialog({
          title: '签名',
          contentContent: (
            <div class="w-full flex-1 shrink-0">
              <input
                class="w-full shrink-0"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  console.log('e.target.value', event.target.files)
                  for (let i = 0; i < event.target.files.length; i++) {
                    fileToBase64Async(event.target.files[i]).then((value) => {
                      const img = new Image()
                      img.src = value
                      img.onload = (e) => {
                        command.executeInsertElementList([
                          {
                            value,
                            width: 150,
                            height: 150 * (img.height / img.width),
                            type: ElementType.IMAGE
                          }
                        ])
                        console.log('img', dialogInstance)
                        dialogInstance.app.unmount()
                      }
                    })
                  }
                }}
                placeholder="请上传签名"
              />
              <div id="image-preview"></div>
            </div>
          )
        })
      }
    },
    {
      name: '格式整理',
      icon: 'word-tool',
      when: (payload) => {
        return !payload.isReadonly
      },
      callback: (command) => {
        command.executeWordTool()
      }
    },
    {
      name: '插入条形码',
      when: (payload) => {
        return !payload.isReadonly && payload.editorTextFocus
      },
      callback: (command) => {
        const content = window.prompt('请输入内容')
        command.executeInsertBarcode1D(content, 200, 100)
      }
    },
    {
      name: '插入二维码',
      when: (payload) => {
        return !payload.isReadonly && payload.editorTextFocus
      },
      callback: (command) => {
        const content = window.prompt('请输入内容')
        command.executeInsertBarcode2D(content, 200, 200)
      }
    },
    {
      name: '插入代码块',
      when: (payload) => {
        return !payload.isReadonly && payload.editorTextFocus
      },
      callback: (command) => {
        const content = window.prompt('请输入内容')
        command.executeInsertCodeblock(content)
      }
    },
    {
      name: '导出文档',
      when: (payload) => true,
      callback: (command) => {
        command.executeExportDocx({
          fileName: 'Awen23333'
        })
      }
    },
    {
      name: '导入文档',
      when: (payload) => true,
      callback: (command) => {
        console.log('导入文档', editConfig.fileUpload.docx)
        editConfig.fileUpload.docx.ref.click()
      }
    },
    {
      name: '导入excel',
      when: (payload) => true,
      callback: (command) => {
        console.log('导入文档', editConfig.fileUpload.excel)
        editConfig.fileUpload.excel.ref.click()
      }
    },
    {
      name: '打开/编辑流程图',
      when: (payload) => {
        return !payload.isReadonly && payload.editorTextFocus
      },
      callback: (command, context) => {
        const extension = context.startElement?.extension
        const data = extension?.name === 'diagram' ? extension.xml : ''
        command.executeLoadDiagram({
          data,
          onDestroy: (message) => {
            if (!message || !message.data) return
            const { bounds } = message
            if (!data) {
              // 新增
              command.executeInsertElementList([
                {
                  type: ElementType.IMAGE,
                  width: bounds.width,
                  height: bounds.height,
                  value: message.data,
                  extension: {
                    name: 'diagram',
                    xml: message.xml
                  }
                }
              ])
            } else {
              // 更新
              command.executeUpdateElementById({
                id: context.startElement.id,
                properties: {
                  width: bounds.width,
                  height: bounds.height,
                  value: message.data,
                  extension: {
                    name: 'diagram',
                    xml: message.xml
                  }
                }
              })
            }
          }
        })
      }
    },
    {
      name: '转成大写',
      when: (payload) => {
        return !payload.isReadonly && payload.editorHasSelection
      },
      callback: (command) => {
        command.executeUpperCase()
      }
    },
    {
      name: '转成小写',
      when: (payload) => {
        return !payload.isReadonly && payload.editorHasSelection
      },
      callback: (command) => {
        command.executeLowerCase()
      }
    }
  ])
}

const offSetEditorListener = () => {
  if (!instance) return
  editConfig.eventList.forEach((item) => {
    instance.eventBus.off(item.eventType, item.callback)
  })
}

const initEditorListener = () => {
  if (!instance) return
  editConfig.eventList.forEach((item) => {
    instance.eventBus.off(item.eventType, item.callback)
    instance.eventBus.on(item.eventType, item.callback)
  })
}

const initEditor = () => {
  instance = null
  nextTick(() => {
    instance = new Editor(
      canvasEditorRef.value,
      {
        header: [
          {
            value: '这是一个test页眉',
            rowFlex: 'center'
          }
        ],
        main: data,
        footer: [
          {
            value: '这是一个test页脚',
            rowFlex: 'center'
          }
        ]
      },
      {
        ...options,
        scrollContainerSelector: '.canvas-editor'
      }
    )

    instance.use(barcode1dPlugin)
    instance.use(barcode2dPlugin)
    instance.use(codeblockPlugin)
    instance.use(docxPlugin)
    instance.use(excelPlugin)
    instance.use(floatingToolbarPlugin)
    instance.use(diagramPlugin)
    instance.use(casePlugin)

    initEditBtnList()
    contextMenuList()
    initEditorListener()
    editConfig.commandList
      .find((item) => item.component === 'select')
      .callback({
        target: {
          value: editConfig.mode
        }
      })
  })
}

initEditor()

onUnmounted(() => {
  offSetEditorListener()
  instance && instance.destroy()
  instance = null
})
</script>
<style lang="scss" scoped>
.canvas-editor {
  ::v-deep(canvas) {
    background-color: rgb(255, 255, 255);
    box-shadow: #9ea1a566 0 2px 12px;
    margin-bottom: 20px;
    cursor: text;
  }
  .comment {
    .comment-item {
      margin-bottom: 10px;
    }
  }
}
</style>
