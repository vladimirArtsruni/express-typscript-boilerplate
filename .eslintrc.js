module.exports = {
    env: {
        node: true
    },
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended'
        // 'plugin:@typescript-eslint/recommended'
    ],
    rules: {
        'eol-last': 2,
        'max-len': [
            2,
            120,
            2,
            {
                ignoreComments: true,
                ignoreRegExpLiterals: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true
            }
        ],
        'object-curly-spacing': [ 2, 'always' ],
        'array-bracket-spacing': [ 2, 'always' ],
        'computed-property-spacing': [ 2, 'always' ],
        'no-multiple-empty-lines': [ 2, { max: 1, 'maxEOF': 1 } ],
        'brace-style': [ 2, '1tbs' ],
        'no-undef': 0,
        'quotes': [ 2, 'single' ],
        '@typescript-eslint/no-unused-vars': 2,
        '@typescript-eslint/member-delimiter-style': 2,
        'comma-dangle': [
            2,
            {
                arrays: 'never',
                objects: 'never',
                imports: 'never',
                exports: 'never',
                functions: 'never'
            }
        ]
    }
}
