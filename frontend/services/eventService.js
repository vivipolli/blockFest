// Chaves para o localStorage
const EVENTS_KEY = 'event3_events'
const EVENT_METADATA_KEY = 'event3_metadata'

const isBrowser = typeof window !== 'undefined'

export const saveEvent = (eventData, metadataUrl, imageUrl) => {
  if (!isBrowser) return null

  try {
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')

    const newEvent = {
      ...eventData,
      id: eventData.id || Date.now().toString(),
      metadataUrl,
      imageUrl,
      createdAt: new Date().toISOString(),
    }

    events.push(newEvent)

    localStorage.setItem(EVENTS_KEY, JSON.stringify(events))

    return newEvent
  } catch (error) {
    console.error('Error saving event:', error)
    throw error
  }
}

export const getEvent = eventId => {
  if (!isBrowser) return null

  try {
    const events = JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
    return events.find(event => event.id.toString() === eventId.toString())
  } catch (error) {
    console.error('Error getting event:', error)
    return null
  }
}

export const getAllEvents = () => {
  if (!isBrowser) return []

  try {
    return JSON.parse(localStorage.getItem(EVENTS_KEY) || '[]')
  } catch (error) {
    console.error('Error getting all events:', error)
    return []
  }
}

export const clearEvents = () => {
  if (!isBrowser) return

  try {
    localStorage.removeItem(EVENTS_KEY)
  } catch (error) {
    console.error('Error clearing events:', error)
  }
}
