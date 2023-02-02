import * as THREE from 'three'
((THREE) => {
  const TargetList = {
    gaze: {},
    click: {},
    hover: {}
  }
  const updateCallbackList = []
  const EventListeners = {}
  const listenerList = {}
  Object.keys(TargetList).forEach(function (v, i) {
    EventListeners[v] = {
      flag: false,
      listener: function (targetList) {
        listenerList[v](targetList, option.camera)
      }
    }
  })
  var option = {}

  THREE.onEvent = function (scene, camera) {
    option.scene = scene || {}
    option.camera = camera || {}
  }
  THREE.onEvent.prototype.removeAll = function () {
    for (const key in TargetList) {
      for (const id in TargetList[key]) {
        delete TargetList[key][id]
      }
    }
  }
  THREE.onEvent.prototype.update = function () {
    for (const key in updateCallbackList) {
      updateCallbackList[key]()
    }
  }
  Object.assign(THREE.Object3D.prototype, {
    on: function (method, callback1, callback2) {
      if (EventListeners.hasOwnProperty(method)) {
        TargetList[method][this.id] = {
          object3d: this,
          callback: Array.from(arguments).slice(1)
        }
        const eventlistener = EventListeners[method]
        if (!eventlistener.flag) {
          eventlistener.flag = true
          eventlistener.listener(TargetList[method])
        }
      } else {
        console.warn("There is no method called '" + method + "';")
      }
    },
    off: function (method) {
      if (method) {
        if (EventListeners.hasOwnProperty(method)) {
          delete TargetList[method][this.id]
        } else {
          console.warn("There is no method called '" + method + "';")
        }
      } else {
        for (const key in TargetList) {
          delete TargetList[key][this.id]
        }
      }
    }
  })
  function getObjList (targetList) {
    const list = []
    for (const key in targetList) {
      const target = targetList[key].object3d
      list.push(target)
    }
    return group2meshlist(list)
  }
  function group2meshlist (list) {
    let l = []
    for (const i in list) {
      if (list[i].type === 'Group') {
        l = l.concat(group2meshlist(list[i].children))
      } else {
        l.push(list[i])
      }
    }
    return l
  }
  function getEventObj (targetList, object3d) {
    return object2group(targetList, object3d)
  }
  function object2group (targetList, object3d) {
    if (targetList[object3d.id]) {
      return targetList[object3d.id]
    } else {
      return object2group(targetList, object3d.parent)
    }
  }
  // WebVR object3d on gazer
  listenerList.gaze = function (targetList, camera) {
    let Gazing = false
    let targetObject
    let obj
    const Eye = new THREE.Raycaster()
    const gazeListener = function () {
      // create a gazeListener loop
      if (targetList) {
        let list = []
        Eye.setFromCamera(new THREE.Vector2(), camera)
        list = getObjList(targetList)
        const intersects = Eye.intersectObjects(list)

        if (intersects.length > 0) {
          if (!Gazing) {
            // trigger once when gaze in
            Gazing = true
            targetObject = intersects[0].object
            obj = getEventObj(targetList, targetObject)
            if (obj.callback[0]) obj.callback[0](targetObject)
          }
        } else {
          if (Gazing && !!obj.callback[1]) {
            obj.callback[1](targetObject)
          }
          Gazing = false
        }
      }
    }
    updateCallbackList.push(gazeListener)
  }
  // object3d on mouse click
  listenerList.click = function (targetList, camera) {
    let targetObject
    let obj
    let Click = false
    const Down = false
    const Mouse = new THREE.Raycaster()
    function down (event) {
      event.preventDefault()
      if (!targetList) return
      let list = []
      Mouse.setFromCamera(
        new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        ),
        camera
      )
      list = getObjList(targetList)
      const intersects = Mouse.intersectObjects(list)

      if (intersects.length > 0) {
        // mouse down trigger
        if (Click) return
        Click = true
        targetObject = intersects[0].object
        obj = getEventObj(targetList, targetObject)
      } else {
        Click = false
      }
    }
    function move (event) {
      event.preventDefault()
      // disable click trigger when mouse moving
      if (Click) Click = false
    }
    function up (event) {
      event.preventDefault()
      if (Click && !!obj.callback[0]) obj.callback[0](targetObject)
      Click = false
    }
    window.addEventListener('mousedown', down, false)
    window.addEventListener('mousemove', move, false)
    window.addEventListener('mouseup', up, false)
  }
  // object3d on mouse hover
  listenerList.hover = function (targetList, camera) {
    let targetObject
    let obj
    let Hover = false
    const Mouse = new THREE.Raycaster()
    window.addEventListener(
      'mousemove',
      function (event) {
        event.preventDefault()
        if (!targetList) return
        let list = []
        Mouse.setFromCamera(
          new THREE.Vector2(
            (event.clientX / window.innerWidth) * 2 - 1,
            -(event.clientY / window.innerHeight) * 2 + 1
          ),
          camera
        )

        list = getObjList(targetList)
        const intersects = Mouse.intersectObjects(list)

        if (intersects.length > 0) {
          if (Hover) return
          Hover = true
          targetObject = intersects[0].object
          obj = getEventObj(targetList, targetObject)
          if (obj.callback[0]) obj.callback[0](targetObject)
        } else {
          if (Hover && !!obj.callback[1]) {
            obj.callback[1](targetObject)
          }
          Hover = false
        }
      },
      false
    )
  }
})(THREE)
export default THREE
