import { useEffect, useState } from "react"

const XIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 6L6 18M6 6l12 12"></path></svg>

const BurgerIcon = <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17h8M5 12h14m-8-5h8"></path></svg>

const BurgerMenu = () => {
  const [open, setOpen] = useState(false)
  useEffect(() => {

    const navUl = document.getElementById('nav-ul')

    if (open) {
      navUl?.classList.remove('hidden', 'items-center')
      navUl?.classList.add('flex', 'flex-col', 'items-start', 'bg-slate-50', 'dark:bg-zinc-900', 'w-full', 'absolute', 'top-full', 'h-fit', 'left-0', 'p-5', 'text-xl')
    } else {
      navUl?.classList.add('hidden');
      navUl?.classList.remove('flex', 'flex-col', 'items-start', 'bg-white', 'dark:bg-zinc-800', 'w-full', 'absolute', 'top-full', 'h-fit', 'left-0', 'p-5', 'text-xl')
    }
  }, [open])

  const handleOpen = () => {
    setOpen(!open)
  }

  return (
    <button type='button' title='open close interactive menu mobile' onClick={handleOpen} className='p-0 m-0 border-none flex items-center text-3xl absolute right-3 sm:hidden'>
      {open ? XIcon : BurgerIcon}
    </button>
  )
}

export default BurgerMenu