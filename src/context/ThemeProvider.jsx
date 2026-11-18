import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeContext } from './ThemeContext'

const STORAGE_KEY = 'stayora-theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

// Returns 'light', 'dark', or null if the visitor has never chosen.
function readSavedChoice() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null // storage can be blocked, e.g. in private mode
  }
}

export default function ThemeProvider({ children }) {
  const [choice, setChoice] = useState(readSavedChoice)
  const [systemDark, setSystemDark] = useState(
    () => window.matchMedia(DARK_QUERY).matches,
  )

  // Follow the device setting while the visitor has not chosen
  useEffect(() => {
    const media = window.matchMedia(DARK_QUERY)
    const handleChange = (event) => setSystemDark(event.matches)
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [])

  const theme = choice ?? (systemDark ? 'dark' : 'light')

  // Add or remove the "dark" class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = useCallback((next) => {
    setChoice(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // Could not save. The theme still works until the page is closed.
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }, [setTheme, theme])

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}