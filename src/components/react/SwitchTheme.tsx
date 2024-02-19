import { useState, useEffect } from 'react'

const Moon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 12.808c-.5 5.347-5.849 9.14-11.107 7.983C-.077 18.6 1.15 3.909 11.112 3C6.394 9.296 14.618 17.462 21 12.808" />
</svg>

const Sun = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
  <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h3M5 5l2.121 2.121M19 5l-2.121 2.121M5 19l2.121-2.121M19 19l-2.121-2.121M12 3v3m0 15v-3m6-6h3m-6 0a3 3 0 1 1-6 0a3 3 0 0 1 6 0" />
</svg>

const SwitchTheme = () => {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    if (theme === 'dark') {
      console.log('dark')
      document.querySelector('html').classList.add('dark')
    } else {
      console.log('light')
      document.querySelector('html').classList.remove('dark')
    }
  }, [theme])

  const handleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button type='button' title='change theme button' onClick={handleTheme} className='p-0 m-0 border-none flex items-center pt-0.5 text-lg'>
      {theme === 'dark' ? Sun : Moon}
    </button>
  )
}

export default SwitchTheme