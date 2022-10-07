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
import 'photo-sphere-viewer/dist/photo-sphere-viewer.css'
import 'photo-sphere-viewer/dist/plugins/markers.css'
import { onMounted } from 'vue'
export default {
  setup (props, { emit }) {
    // 初始化3d旋转镜头
    const init360Panorama = () => {
      const baseUrl = window.location.origin + window.location.pathname
      const animatedValues = {
        latitude: { start: -Math.PI / 2, end: 0.2 },
        longitude: { start: Math.PI, end: 0 },
        zoom: { start: 0, end: 50 },
        fisheye: { start: 2, end: 0 }
      }
      const tooltipImg1 = require('@/static/image/heishou.png')
      const tooltipImg2 = require('@/static/image/heishou2.jpg')
      const viewer = new Viewer({
        container: document.querySelector('#viewer'),
        panorama: baseUrl + '360range/360bg.jpg',
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
          {
            title: 'Change image',
            content: '🔄 奥利给，把握住了！！',
            onClick: () => {
              intro().then()
            }
          },
          'caption',
          'fullscreen'
        ],
        plugins: [
          [
            MarkersPlugin, {
            // list of markers
              markers: [
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
                    className: 'custom-tooltip custom-tooltip-0',
                    position: 'top',
                    trigger: 'click'
                  },
                  latitude: 0.11,
                  longitude: -0.35,
                  image: baseUrl + '360range/pin-blue.png',
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
                    className: 'custom-tooltip custom-tooltip-1',
                    position: 'top',
                    trigger: 'click'
                  },
                  latitude: 0.11,
                  longitude: 2.55,
                  image: baseUrl + '360range/pin-blue.png',
                  width: 32,
                  height: 32,
                  anchor: 'bottom center'
                }
              ]
            }
          ]
        ]
      })
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

      viewer.on('ready', () => {
        viewer.plugins.markers.on('select-marker', (e, marker, data) => {
          emit('select-marker', { e, marker, data })
        })
        intro().then(() => {
          console.log('viewer', viewer)
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
</style>
