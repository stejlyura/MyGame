import '@/assets/index.css'
import Field from './components/field/Field'
import { Overlay } from './components/overlay/Overlay'

function App() { 

  return (
      <main className='w-full h-full'>
        <Overlay/>
        <Field />
      </main>
  )
}

export default App
