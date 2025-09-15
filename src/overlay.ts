
import SummitOverlay from './lib/SummitOverlay.svelte'
import { mount } from 'svelte'

const app = mount(SummitOverlay, {
  target: document.getElementById('overlay')!,
})

export default app
