import { defineConfig, presetAttributify } from 'unocss'
import presetWind3 from '@unocss/preset-wind3'
import transformerAttributifyJsx from '@unocss/transformer-attributify-jsx'

export default defineConfig({
  // ...UnoCSS options
  presets: [presetWind3(), presetAttributify()],
  rules: [],
  transformers: [
    transformerAttributifyJsx() // <--
  ]
})
