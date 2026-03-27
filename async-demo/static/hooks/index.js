import { ref } from 'vue'
export const testFunction = () => {
  console.log('testFunction')
}
export const useState = (initialValue = 0) => {
  let state = ref(initialValue)
  return {
    state,
  }
}