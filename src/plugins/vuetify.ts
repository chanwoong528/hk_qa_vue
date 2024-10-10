/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    light: true,
    defaultTheme: 'myCustomTheme',
    themes: {
      myCustomTheme: {
        dark: false,
        variables: {
          'border-color': '#e2e8f0',
          'border-opacity' : '1',
        },
        colors: {
          primary: '#6d7fff',
          background: '#eef1f9',
          'on-surface': '#475569',
          
        }
      }
    }
  }
})
