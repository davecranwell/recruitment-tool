export function safeRedirect(to: FormDataEntryValue | string | null | undefined, defaultRedirect: string = '/') {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

export function titleCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function dateTimeFormat(dateTimeString: string | Date) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(new Date(dateTimeString))
}

export function formDataToJson(formData: FormData) {
  var object = {}
  formData.forEach((value: any, key: string) => {
    // Reflect.has in favor of: object.hasOwnProperty(key)
    if (!Reflect.has(object, key)) {
      object[key] = value
      return
    }
    if (!Array.isArray(object[key])) {
      object[key] = [object[key]]
    }
    object[key].push(value)
  })
  return object
}

export function camelToSentence(string: string) {
  return toSentence(string.replace(/([A-Z])/g, ' $1'))
}

export function toSentence(string: string) {
  return string
    .toLowerCase()
    .replace('_', ' ')
    .replace(/^./, (str) => str.toUpperCase())
}
