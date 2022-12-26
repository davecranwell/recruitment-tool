const TextareaLocalStorage: React.FC<Props> = ({ tabs }) => {
  const [value, setValue] = useState('')

  useEffect(() => {
    const storedValue = localStorage.getItem('textarea-value')
    if (storedValue) {
      const { value, timestamp } = JSON.parse(storedValue)
      if (timestamp > Date.now()) {
        setValue(value)
      }
    }
  }, [])

  function handleChange(event) {
    const { value } = event.target
    setValue(value)
    localStorage.setItem('textarea-value', JSON.stringify({ value, timestamp: Date.now() + 3600 * 1000 }))
  }

  return <textarea value={value} onChange={handleChange} />
}

export default TextareaLocalStorage
