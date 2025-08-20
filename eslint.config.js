// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    rules: {
      'no-unexpected-multiline': 'off',
      'style/template-tag-spacing': 'off',
      'style/indent': 'off',
    },
    ignores: ['docs/**/*.md'],
  },
)
