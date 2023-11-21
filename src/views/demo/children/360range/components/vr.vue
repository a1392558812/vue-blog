<template>
  <div class="width100 height100">
    <div id="viewer" class="width100 height100"></div>
    <div id="custom-tooltip-0"></div>
    <div id="custom-tooltip-1"></div>
  </div>
</template>
<script>
import { Viewer, utils } from 'photo-sphere-viewer/dist/photo-sphere-viewer.js'
import { MarkersPlugin } from 'photo-sphere-viewer/dist/plugins/markers.js'
import { GalleryPlugin } from 'photo-sphere-viewer/dist/plugins/gallery.js'
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import 'photo-sphere-viewer/dist/plugins/gallery.css'

import { baseUrlFun } from '@/common/methods.js'
import { onMounted } from 'vue'
export default {
  setup (props, { emit }) {
    // 初始化3d旋转镜头
    const init360Panorama = () => {
      const baseUrl = baseUrlFun()
      const tooltipImg1 = require('@/static/image/heishou.png')
      const tooltipImg2 = require('@/static/image/heishou2.jpg')
      const animatedValues = {
        latitude: { start: -Math.PI / 2, end: 0.2 },
        longitude: { start: Math.PI, end: 0 },
        zoom: { start: 0, end: 50 },
        fisheye: { start: 2, end: 0 }
      }
      const markerLists = {
        '360bg1': [
          {
            id: 'custom-tooltip-0',
            data: {
              content: '标记custom-tooltip-0'
            },
            tooltip: {
              content: `
                      <div class="custom-tooltip-content-wrap">
                        <div class="custom-tooltip-content">提示：这里是黑手之山！</div>
                        <img class="line-height-1 custom-tooltip-image" src='${tooltipImg1}'/>
                      </div>
                      `,
              toastContent: 'toastContent1',
              className: 'custom-tooltip custom-tooltip-0',
              position: 'top',
              trigger: 'click'
            },
            latitude: 0.11,
            longitude: -0.35,
            image: baseUrl + 'demo-static/360range/pin-blue.png',
            width: 32,
            height: 32,
            anchor: 'bottom center'
          },
          {
            id: 'custom-tooltip-1',
            data: {
              content: '标记custom-tooltip-1'
            },
            tooltip: {
              content: `
                      <div class="custom-tooltip-content-wrap">
                        <div class="custom-tooltip-content">哈哈！这里还是黑手之山！</div>
                        <img class="line-height-1 custom-tooltip-image" src='${tooltipImg2}'/>
                      </div>
                      `,
              toastContent: 'toastContent2',
              className: 'custom-tooltip custom-tooltip-1',
              position: 'top',
              trigger: 'click'
            },
            latitude: 0.11,
            longitude: 2.55,
            image: baseUrl + 'demo-static/360range/pin-blue.png',
            width: 32,
            height: 32,
            anchor: 'bottom center'
          }
        ],
        '360bg2': [
          {
            id: 'custom-tooltip-2',
            data: {
              content: '标记custom-tooltip-2'
            },
            tooltip: {
              content: '场景2的content🥵🥵',
              toastContent: 'toastContent3',
              className: 'custom-tooltip custom-tooltip-2',
              position: 'top',
              trigger: 'click'
            },
            latitude: 0.31,
            longitude: -0.15,
            image: baseUrl + 'demo-static/360range/pin-blue.png',
            width: 32,
            height: 32,
            anchor: 'bottom center'
          }
        ],
        '360bg3': [
          {
            id: 'custom-tooltip-3',
            data: {
              content: '标记custom-tooltip-3'
            },
            tooltip: {
              content: '场景3的content🥵🥵',
              toastContent: 'toastContent4',
              className: 'custom-tooltip custom-tooltip-3',
              position: 'top',
              trigger: 'click'
            },
            latitude: 0.31,
            longitude: -0.25,
            image: baseUrl + 'demo-static/360range/pin-blue.png',
            width: 32,
            height: 32,
            anchor: 'bottom center'
          }
        ]
      }
      const viewer = new Viewer({
        container: document.querySelector('#viewer'),
        panorama: baseUrl + 'demo-static/360range/360bg1.jpg',
        caption: '大风车啊转啊转~',
        defaultLat: animatedValues.latitude.start,
        defaultLong: animatedValues.longitude.start,
        defaultZoomLvl: animatedValues.zoom.start,
        fisheye: animatedValues.fisheye.start,
        navbar: [
          'zoom',
          'move',
          'autorotate',
          'markers',
          'markersList',
          'gallery',
          {
            title: 'Change image',
            content: '🔄 奥利给，把握住了！！',
            onClick: (e, data, other) => {
              console.log('e, data, other', e, data, other)
              intro().then()
            }
          },
          'caption',
          'fullscreen'
        ],
        plugins: [
          [
            MarkersPlugin, {}
          ],
          [
            GalleryPlugin, {
              visibleOnLoad: true,
              items: [
                {
                  id: '360bg1',
                  name: '全景1',
                  panorama: baseUrl + 'demo-static/360range/360bg1.jpg',
                  thumbnail: baseUrl + 'demo-static/360range/preview/preview1.png',
                  options: {
                    caption: '大风车啊转啊转~'
                  }
                },
                {
                  id: '360bg2',
                  name: '全景2',
                  panorama: baseUrl + 'demo-static/360range/360bg2.jpg',
                  thumbnail: baseUrl + 'demo-static/360range/preview/preview2.png',
                  options: {
                    caption: 'caption2'
                  }
                },
                {
                  id: '360bg3',
                  name: '全景3',
                  panorama: baseUrl + 'demo-static/360range/360bg3.jpg',
                  thumbnail: baseUrl + 'demo-static/360range/preview/preview3.png',
                  options: {
                    caption: 'caption3'
                  }
                }
              ]
            }
          ]
        ]
      })
      const markersPlugin = viewer.getPlugin(MarkersPlugin)
      const intro = () => {
        return new Promise(resolve => {
          viewer.stopAutorotate()
          new utils.Animation({
            properties: animatedValues,
            duration: 2500,
            easing: 'inOutQuad',
            onTick: (properties) => {
              viewer.setOption('fisheye', properties.fisheye)
              viewer.rotate({ longitude: properties.longitude, latitude: properties.latitude })
              viewer.zoom(properties.zoom)
            }
          }).then(() => {
            viewer.setOptions({
              autorotateLat: animatedValues.latitude.end,
              autorotateDelay: 1000,
              autorotateIdle: true
            })
            viewer.startAutorotate()
            resolve()
          })
        })
      }
      viewer.on('panorama-loaded', (e, panorama) => {
        const imageStrArr = panorama.panorama.split('/')
        const panoramaId = imageStrArr[imageStrArr.length - 1].split('.')[0]
        markersPlugin.clearMarkers()
        markerLists[panoramaId].forEach(item => {
          markersPlugin.addMarker(item)
        })
      })
      viewer.on('ready', () => {
        viewer.plugins.markers.on('select-marker', (e, marker, data) => {
          emit('select-marker', { e, marker, data })
        })
        $('.psv-gallery-item').click((e) => {
          markersPlugin.clearMarkers()
        })
        intro().then(() => {
          viewer.getPlugin(MarkersPlugin).showMarkerTooltip('custom-tooltip-0')
        })
      })
    }

    onMounted(() => {
      init360Panorama()
    })
  }
}
</script>
<style lang="scss" scoped>
  ::v-deep(.custom-tooltip) {
    max-width: none;
    width: 300px;
    padding: 0;
    box-shadow: 0 0 0 3px white;
    .custom-tooltip-image{
      width: 100%;
      border-radius: 4px 4px 0 0;
      display: block;
    }
    .custom-tooltip-content{
      font-size: 16px;
      padding: 20px 20px;
    }
  }
  #viewer {
    ::v-deep(.psv-panel-menu-item) {
        .psv-panel-menu-item-label{
            .custom-tooltip-image{
                width: 250px;
            }
        }
    }
  }
</style>
