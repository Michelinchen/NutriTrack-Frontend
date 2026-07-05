import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { ref } from 'vue'
import MealList from '@/components/MealList.vue'
import axios from 'axios'

// Mock 1: Login — Factory, die einen eingeloggten User liefert
vi.mock('@auth0/auth0-vue', () => ({
  useAuth0: () => ({ user: ref({ email: 'test@test.de' }) })
}))

// Mock 2: Netzwerk
vi.mock('axios')

describe('MealList', () => {
  it('zeigt die Meals vom Backend an', async () => {
    // ARRANGE: was soll der GET zurückgeben?
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: false }
      ]
    })

    // ACT
    const wrapper = mount(MealList)
    await flushPromises()          // auf das async Laden warten!

    // ASSERT
    expect(wrapper.text()).toContain('Burger')
  })

  it('gib eine leere Liste zurück', async () => {
    vi.mocked(axios, true).get.mockResolvedValue({
      data: []
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(0)
  })

  it('zeigt die Kalorien richtig an', async () =>{
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: false }
      ]
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.text()).toContain('200')
  })

  it('zeigt bei Favoriten den gelben Stern', async () => {
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: true }
      ]
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.text()).toContain('⭐')
  })

  it('zeigt bei Favoriten den leeren Stern', async () => {
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: false }
      ]
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.text()).toContain('☆')
  })

  it('zeig eine Fehlermeldung an', async () => {
    vi.mocked(axios, true).get.mockRejectedValue(new Error())

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.text()).toContain('Error while loading meals.')
  })

  it('Formular wird angezeigt', async () => {

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('Rendert Liste mit 2 Einträgen', async () => {
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: false},
        { id: 2, name: 'Pizza', macro: { countFat: 50, countCarbs: 5, countProteins: 2 }, favorite: false}
      ]
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(wrapper.findAll('li')).toHaveLength(2)
  })

  it('Axios wird mit dem richtigen Owner aufgerufen', async () => {
    vi.mocked(axios, true).get.mockResolvedValue({
      data: [
        { id: 1, name: 'Burger', macro: { countFat: 20, countCarbs: 3, countProteins: 2 }, favorite: false},
        { id: 2, name: 'Pizza', macro: { countFat: 50, countCarbs: 5, countProteins: 2 }, favorite: false}
      ]
    })

    const wrapper = mount(MealList)
    await flushPromises()

    expect(axios.get).toHaveBeenCalledWith(expect.anything(), { params: { Owner: 'test@test.de'}})
  })
})
