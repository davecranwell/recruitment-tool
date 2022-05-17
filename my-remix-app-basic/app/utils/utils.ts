export function safeRedirect(to: FormDataEntryValue | string | null | undefined, defaultRedirect: string = '/') {
  if (!to || typeof to !== 'string') {
    return defaultRedirect
  }

  if (!to.startsWith('/') || to.startsWith('//')) {
    return defaultRedirect
  }

  return to
}

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export function titleCase(string:string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}