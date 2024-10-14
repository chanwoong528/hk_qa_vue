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
          'border-color': '#d9e3ef',
          'border-opacity' : '1',
          'high-emphasis-opacity': '1',
          'input-control-height': '26px',
          'field-input-padding-top': '8px',
          'field-input-padding-bottom': '8px',
          'field-border-opacity': '0.2',
          'table-row-height': '68px',
          'activated-opacity': '0.2'
          
        },
        colors: {
          primary: '#296ae5',
          background: '#f6f9ff',
          'on-surface': '#1e293b',
          
          
          
        }
      }
    }
  }
})
