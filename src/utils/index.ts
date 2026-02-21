import { i18n } from '@/i18n'

export function formatDate(dateString: string): string {
  const locale = i18n.global.locale.value
  let dateFormat = 'pl-PL'
  if (locale === 'en') {
    dateFormat = 'en-US'
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString(dateFormat, options)
}
