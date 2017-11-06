module.exports = () => (code, state) => `
import * as React from 'react'

export default function ${state.componentName}() {
  /* tslint:disable:max-line-length */
  return ${code}
  /* tslint:enable:max-line-length */
}
`
