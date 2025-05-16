
module.exports = {
    "extends": "airbnb",
    "installedESLint": true,
    "plugins": [
        "react",
        "jsx-a11y",
        "import"
    ],
    "rules": {
      "max-len": [1, 120, 2, {ignoreComments: true}],
      "quote-props": [1, "consistent-as-needed"],
      "no-cond-assign": [2, "except-parens"],
      "radix": 0,
      "space-infix-ops": 0,
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used" }],
      "default-case": 0,
      "no-else-return": 0,
      "no-param-reassign": 0,
      "quotes": 0,
          // enforces no braces where they can be omitted
    // http://eslint.org/docs/rules/arrow-body-style
    // TODO: enable requireReturnForObjectLiteral?
    'arrow-body-style': ['warn', 'as-needed', {
      requireReturnForObjectLiteral: false,
    }],

    // require parens in arrow function arguments
    // http://eslint.org/docs/rules/arrow-parens
    'arrow-parens': ['warn', 'as-needed', {
      requireForBlockBody: true,
    }],

    // require space before/after arrow function's arrow
    // http://eslint.org/docs/rules/arrow-spacing
    'arrow-spacing': ['warn', { before: true, after: true }],

    // verify super() callings in constructors
    'constructor-super': 'warn',

    // enforce the spacing around the * in generator functions
    // http://eslint.org/docs/rules/generator-star-spacing
    'generator-star-spacing': ['warn', { before: false, after: true }],

    // disallow modifying variables of class declarations
    // http://eslint.org/docs/rules/no-class-assign
    'no-class-assign': 'warn',

    // disallow arrow functions where they could be confused with comparisons
    // http://eslint.org/docs/rules/no-confusing-arrow
    'no-confusing-arrow': ['warn', {
      allowParens: true,
    }],

    // disallow modifying variables that are declared using const
    'no-const-assign': 'warn',

    // disallow duplicate class members
    // http://eslint.org/docs/rules/no-dupe-class-members
    'no-dupe-class-members': 'warn',

    // disallow importing from the same path more than once
    // http://eslint.org/docs/rules/no-duplicate-imports
    'no-duplicate-imports': 'warn',

    // disallow symbol constructor
    // http://eslint.org/docs/rules/no-new-symbol
    'no-new-symbol': 'warn',

    // disallow specific imports
    // http://eslint.org/docs/rules/no-restricted-imports
    'no-restricted-imports': 'off',

    // disallow to use this/super before super() calling in constructors.
    // http://eslint.org/docs/rules/no-this-before-super
    'no-this-before-super': 'warn',

    // disallow useless computed property keys
    // http://eslint.org/docs/rules/no-useless-computed-key
    'no-useless-computed-key': 'warn',

    // disallow unnecessary constructor
    // http://eslint.org/docs/rules/no-useless-constructor
    'no-useless-constructor': 'warn',

    // disallow renaming import, export, and destructured assignments to the same name
    // http://eslint.org/docs/rules/no-useless-rename
    'no-useless-rename': ['warn', {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    }],

    // require let or const instead of var
    'no-var': 'warn',

    // require method and property shorthand syntax for object literals
    // http://eslint.org/docs/rules/object-shorthand
    'object-shorthand': ['warn', 'always', {
      ignoreConstructors: false,
      avoidQuotes: true,
    }],

    // suggest using arrow functions as callbacks
    'prefer-arrow-callback': ['warn', {
      allowNamedFunctions: false,
      allowUnboundThis: true,
    }],

    // suggest using of const declaration for variables that are never modified after declared
    'prefer-const': ['warn', {
      destructuring: 'any',
      ignoreReadBeforeAssign: true,
    }],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // http://eslint.org/docs/rules/prefer-numeric-literals
    'prefer-numeric-literals': 'warn',

    // suggest using Reflect methods where applicable
    // http://eslint.org/docs/rules/prefer-reflect
    // TODO: enable?
    'prefer-reflect': 'off',

    // use rest parameters instead of arguments
    // http://eslint.org/docs/rules/prefer-rest-params
    'prefer-rest-params': 'warn',

    // suggest using the spread operator instead of .apply()
    // http://eslint.org/docs/rules/prefer-spread
    'prefer-spread': 'warn',

    // suggest using template literals instead of string concatenation
    // http://eslint.org/docs/rules/prefer-template
    'prefer-template': 'warn',

    // disallow generator functions that do not have yield
    // http://eslint.org/docs/rules/require-yield
    'require-yield': 'warn',

    // enforce spacing between object rest-spread
    // http://eslint.org/docs/rules/rest-spread-spacing
    'rest-spread-spacing': ['warn', 'never'],

    // import sorting
    // http://eslint.org/docs/rules/sort-imports
    'sort-imports': ['off', {
      ignoreCase: false,
      ignoreMemberSort: false,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    }],

    // require a Symbol description
    // http://eslint.org/docs/rules/symbol-description
    'symbol-description': 'warn',

    // enforce usage of spacing in template strings
    // http://eslint.org/docs/rules/template-curly-spacing
    'template-curly-spacing': 'warn',

    // enforce spacing around the * in yield* expressions
    // http://eslint.org/docs/rules/yield-star-spacing
    'yield-star-spacing': ['warn', 'after'],
    strict: ['warn', 'never'],
    // enforces getter/setter pairs in objects
    'accessor-pairs': 'off',

    // enforces return statements in callbacks of array's methods
    // http://eslint.org/docs/rules/array-callback-return
    'array-callback-return': 'warn',

    // treat var statements as if they were block scoped
    'block-scoped-var': 'warn',

    // specify the maximum cyclomatic complexity allowed in a program
    complexity: ['off', 11],

    // enforce that class methods use "this"
    // http://eslint.org/docs/rules/class-methods-use-this
    'class-methods-use-this': ['warn', {
      exceptMethods: [],
    }],

    // require return statements to either always or never specify values
    'consistent-return': 'warn',

    // specify curly brace conventions for all control statements
    curly: ['warn', 'multi-line'],

    // require default case in switch statements
    'default-case': ['warn', { commentPattern: '^no default$' }],

    // encourages use of dot notation whenever possible
    'dot-notation': ['warn', { allowKeywords: true }],

    // enforces consistent newlines before or after dots
    // http://eslint.org/docs/rules/dot-location
    'dot-location': ['warn', 'property'],

    // require the use of === and !==
    // http://eslint.org/docs/rules/eqeqeq
    eqeqeq: ['warn', 'allow-null'],

    // make sure for-in loops have an if statement
    'guard-for-in': 'warn',

    // disallow the use of alert, confirm, and prompt
    'no-alert': 'warn',

    // disallow use of arguments.caller or arguments.callee
    'no-caller': 'warn',

    // disallow lexical declarations in case/default clauses
    // http://eslint.org/docs/rules/no-case-declarations.html
    'no-case-declarations': 'warn',

    // disallow division operators explicitly at beginning of regular expression
    // http://eslint.org/docs/rules/no-div-regex
    'no-div-regex': 'off',

    // disallow else after a return in an if
    'no-else-return': 'warn',

    // disallow empty functions, except for standalone funcs/arrows
    // http://eslint.org/docs/rules/no-empty-function
    'no-empty-function': ['warn', {
      allow: [
        'arrowFunctions',
        'functions',
        'methods',
      ]
    }],

    // disallow empty destructuring patterns
    // http://eslint.org/docs/rules/no-empty-pattern
    'no-empty-pattern': 'warn',

    // disallow comparisons to null without a type-checking operator
    'no-eq-null': 'off',

    // disallow use of eval()
    'no-eval': 'warn',

    // disallow adding to native types
    'no-extend-native': 'warn',

    // disallow unnecessary function binding
    'no-extra-bind': 'warn',

    // disallow Unnecessary Labels
    // http://eslint.org/docs/rules/no-extra-label
    'no-extra-label': 'warn',

    // disallow fallthrough of case statements
    'no-fallthrough': 'warn',

    // disallow the use of leading or trailing decimal points in numeric literals
    'no-floating-decimal': 'warn',

    // disallow reassignments of native objects or read-only globals
    // http://eslint.org/docs/rules/no-global-assign
    'no-global-assign': ['warn', { exceptions: [] }],
    // deprecated in favor of no-global-assign
    'no-native-reassign': 'off',

    // disallow implicit type conversions
    // http://eslint.org/docs/rules/no-implicit-coercion
    'no-implicit-coercion': ['off', {
      boolean: false,
      number: true,
      string: true,
      allow: [],
    }],

    // disallow var and named functions in global scope
    // http://eslint.org/docs/rules/no-implicit-globals
    'no-implicit-globals': 'off',

    // disallow use of eval()-like methods
    'no-implied-eval': 'warn',

    // disallow this keywords outside of classes or class-like objects
    'no-invalid-this': 'off',

    // disallow usage of __iterator__ property
    'no-iterator': 'warn',

    // disallow use of labels for anything other then loops and switches
    'no-labels': ['warn', { allowLoop: false, allowSwitch: false }],

    // disallow unnecessary nested blocks
    'no-lone-blocks': 'warn',

    // disallow creation of functions within loops
    'no-loop-func': 'warn',

    // disallow magic numbers
    // http://eslint.org/docs/rules/no-magic-numbers
    'no-magic-numbers': ['off', {
      ignore: [],
      ignoreArrayIndexes: true,
      enforceConst: true,
      detectObjects: false,
    }],

    // disallow use of multiple spaces
    'no-multi-spaces': 'warn',

    // disallow use of multiline strings
    'no-multi-str': 'warn',

    // disallow use of new operator when not part of the assignment or comparison
    'no-new': 'warn',

    // disallow use of new operator for Function object
    'no-new-func': 'warn',

    // disallows creating new instances of String, Number, and Boolean
    'no-new-wrappers': 'warn',

    // disallow use of (old style) octal literals
    'no-octal': 'warn',

    // disallow use of octal escape sequences in string literals, such as
    // var foo = 'Copyright \251';
    'no-octal-escape': 'warn',

    // disallow reassignment of function parameters
    // disallow parameter object manipulation
    // rule: http://eslint.org/docs/rules/no-param-reassign.html
    'no-param-reassign': ['warn', { props: true }],

    // disallow usage of __proto__ property
    'no-proto': 'warn',

    // disallow declaring the same variable more then once
    'no-redeclare': 'warn',

    // disallow certain object properties
    // http://eslint.org/docs/rules/no-restricted-properties
    'no-restricted-properties': ['warn', {
      object: 'arguments',
      property: 'callee',
      message: 'arguments.callee is deprecated,'
    }, {
      property: '__defineGetter__',
      message: 'Please use Object.defineProperty instead.',
    }, {
      property: '__defineSetter__',
      message: 'Please use Object.defineProperty instead.',
    }],

    // disallow use of assignment in return statement
    'no-return-assign': 'warn',

    // disallow use of `javascript:` urls.
    'no-script-url': 'warn',

    // disallow self assignment
    // http://eslint.org/docs/rules/no-self-assign
    'no-self-assign': 'warn',

    // disallow comparisons where both sides are exactly the same
    'no-self-compare': 'warn',

    // disallow use of comma operator
    'no-sequences': 'warn',

    // restrict what can be thrown as an exception
    'no-throw-literal': 'warn',

    // disallow unmodified conditions of loops
    // http://eslint.org/docs/rules/no-unmodified-loop-condition
    'no-unmodified-loop-condition': 'off',

    // disallow usage of expressions in statement position
    'no-unused-expressions': ['warn', {
      allowShortCircuit: false,
      allowTernary: false,
    }],

    // disallow unused labels
    // http://eslint.org/docs/rules/no-unused-labels
    'no-unused-labels': 'warn',

    // disallow unnecessary .call() and .apply()
    'no-useless-call': 'off',

    // disallow useless string concatenation
    // http://eslint.org/docs/rules/no-useless-concat
    'no-useless-concat': 'warn',

    // disallow unnecessary string escaping
    // http://eslint.org/docs/rules/no-useless-escape
    'no-useless-escape': 'warn',

    // disallow use of void operator
    // http://eslint.org/docs/rules/no-void
    'no-void': 'warn',

    // disallow usage of configurable warning terms in comments: e.g. todo
    'no-warning-comments': ['off', { terms: ['todo', 'fixme', 'xxx'], location: 'start' }],

    // disallow use of the with statement
    'no-with': 'warn',

    // require use of the second argument for parseInt()
    radix: 'warn',

    // requires to declare all vars on top of their containing scope
    'vars-on-top': 'warn',

    // require immediate function invocation to be wrapped in parentheses
    // http://eslint.org/docs/rules/wrap-iife.html
    'wrap-iife': ['warn', 'outside', { functionPrototypeMethods: false }],

    // require or disallow Yoda conditions
    yoda: 'warn',
     // require trailing commas in multiline object literals
    'comma-dangle': ['warn', 'always-multiline'],

    // disallow assignment in conditional expressions
    'no-cond-assign': ['warn', 'always'],

    // disallow use of console
    'no-console': 'warn',

    // disallow use of constant expressions in conditions
    'no-constant-condition': 'warn',

    // disallow control characters in regular expressions
    'no-control-regex': 'warn',

    // disallow use of debugger
    'no-debugger': 'warn',

    // disallow duplicate arguments in functions
    'no-dupe-args': 'warn',

    // disallow duplicate keys when creating object literals
    'no-dupe-keys': 'warn',

    // disallow a duplicate case label.
    'no-duplicate-case': 'warn',

    // disallow empty statements
    'no-empty': 'warn',

    // disallow the use of empty character classes in regular expressions
    'no-empty-character-class': 'warn',

    // disallow assigning to the exception in a catch block
    'no-ex-assign': 'warn',

    // disallow double-negation boolean casts in a boolean context
    // http://eslint.org/docs/rules/no-extra-boolean-cast
    'no-extra-boolean-cast': 'warn',

    // disallow unnecessary parentheses
    // http://eslint.org/docs/rules/no-extra-parens
    'no-extra-parens': ['off', 'all', {
      conditionalAssign: true,
      nestedBinaryExpressions: false,
      returnAssign: false,
    }],

    // disallow unnecessary semicolons
    'no-extra-semi': 'warn',

    // disallow overwriting functions written as function declarations
    'no-func-assign': 'warn',

    // disallow function or variable declarations in nested blocks
    'no-inner-declarations': 'warn',

    // disallow invalid regular expression strings in the RegExp constructor
    'no-invalid-regexp': 'warn',

    // disallow irregular whitespace outside of strings and comments
    'no-irregular-whitespace': 'warn',

    // disallow the use of object properties of the global object (Math and JSON) as functions
    'no-obj-calls': 'warn',

    // disallow use of Object.prototypes builtins directly
    // http://eslint.org/docs/rules/no-prototype-builtins
    'no-prototype-builtins': 'warn',

    // disallow multiple spaces in a regular expression literal
    'no-regex-spaces': 'warn',

    // disallow sparse arrays
    'no-sparse-arrays': 'warn',

    // Disallow template literal placeholder syntax in regular strings
    // http://eslint.org/docs/rules/no-template-curly-in-string
    'no-template-curly-in-string': 'warn',

    // Avoid code that looks like two expressions but is actually one
    // http://eslint.org/docs/rules/no-unexpected-multiline
    'no-unexpected-multiline': 'warn',

    // disallow unreachable statements after a return, throw, continue, or break statement
    'no-unreachable': 'warn',

    // disallow return/throw/break/continue inside finally blocks
    // http://eslint.org/docs/rules/no-unsafe-finally
    'no-unsafe-finally': 'warn',

    // disallow negating the left operand of relational operators
    // http://eslint.org/docs/rules/no-unsafe-negation
    'no-unsafe-negation': 'warn',
    // disallow negation of the left operand of an in expression
    // deprecated in favor of no-unsafe-negation
    'no-negated-in-lhs': 'off',

    // disallow comparisons with the value NaN
    'use-isnan': 'warn',

    // ensure JSDoc comments are valid
    // http://eslint.org/docs/rules/valid-jsdoc
    'valid-jsdoc': 'off',

    // ensure that the results of typeof are compared against a valid string
    // http://eslint.org/docs/rules/valid-typeof
    'valid-typeof': ['warn', { requireStringLiterals: true }],
     // Static analysis:

    // ensure imports point to files/modules that can be resolved
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    'import/no-unresolved': ['warn', { commonjs: true, caseSensitive: true }],

    // ensure named imports coupled with named exports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/named.md#when-not-to-use-it
    'import/named': 'off',

    // ensure default import coupled with default export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/default.md#when-not-to-use-it
    'import/default': 'off',

    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/namespace.md
    'import/namespace': 'off',

    // Helpful warnings:

    // disallow invalid exports, e.g. multiple defaults
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/export.md
    'import/export': 'warn',

    // do not allow a default import name to match a named export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default.md
    'import/no-named-as-default': 'warn',

    // warn on accessing default export property names that are also named exports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-named-as-default-member.md
    'import/no-named-as-default-member': 'warn',

    // disallow use of jsdoc-marked-deprecated imports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-deprecated.md
    'import/no-deprecated': 'off',

    // Forbid the use of extraneous packages
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-extraneous-dependencies': ['warn', {
      devDependencies: false,
      optionalDependencies: false,
    }],

    // Forbid mutable exports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-mutable-exports.md
    'import/no-mutable-exports': 'warn',

    // Module systems:

    // disallow require()
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-commonjs.md
    'import/no-commonjs': 'off',

    // disallow AMD require/define
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-amd.md
    'import/no-amd': 'warn',

    // No Node.js builtin modules
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-nodejs-modules.md
    // TODO: enable?
    'import/no-nodejs-modules': 'off',

    // Style guide:

    // disallow non-import statements appearing before import statements
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/first.md
    'import/first': ['warn', 'absolute-first'],

    // disallow non-import statements appearing before import statements
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/imports-first.md
    // deprecated: use `import/first`
    'import/imports-first': 'off',

    // disallow duplicate imports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    'import/no-duplicates': 'warn',

    // disallow namespace imports
    // TODO: enable?
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-namespace.md
    'import/no-namespace': 'off',

    // Ensure consistent use of file extension within the import path
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/extensions.md
    'import/extensions': ['warn', 'always', {
      js: 'never',
      jsx: 'never',
    }],

    // Enforce a convention in module import order
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    // TODO: enable?
    'import/order': ['off', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
    }],

    // Require a newline after the last import/require in a group
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/newline-after-import.md
    'import/newline-after-import': 'warn',

    // Require modules with a single export to use a default export
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'import/prefer-default-export': 'warn',

    // Restrict which files can be imported in a given folder
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-restricted-paths.md
    'import/no-restricted-paths': 'off',

    // Forbid modules to have too many dependencies
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/max-dependencies.md
    'import/max-dependencies': ['off', { max: 10 }],

    // Forbid import of modules using absolute paths
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-absolute-path.md
    'import/no-absolute-path': 'warn',

    // Forbid require() calls with expressions
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-dynamic-require.md
    'import/no-dynamic-require': 'warn',

    // prevent importing the submodules of other modules
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-internal-modules.md
    'import/no-internal-modules': ['off', {
      allow: [],
    }],

    // Warn if a module could be mistakenly parsed as a script by a consumer
    // leveraging Unambiguous JavaScript Grammar
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/unambiguous.md
    // this should not be enabled until this proposal has at least been *presented* to TC39.
    // At the moment, it's not a thing.
    'import/unambiguous': 'off',

    // Forbid Webpack loader syntax in imports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-webpack-loader-syntax.md
    'import/no-webpack-loader-syntax': 'warn',

    // Prevent unassigned imports
    // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unassigned-import.md
    // importing for side effects is perfectly acceptable, if you need side effects.
    'import/no-unassigned-import': 'off',
      // enforce return after a callback
    'callback-return': 'off',

    // require all requires be top-level
    // http://eslint.org/docs/rules/global-require
    'global-require': 'warn',

    // enforces error handling in callbacks (node environment)
    'handle-callback-err': 'off',

    // disallow mixing regular variable and require declarations
    'no-mixed-requires': ['off', false],

    // disallow use of new operator with the require function
    'no-new-require': 'warn',

    // disallow string concatenation with __dirname and __filename
    // http://eslint.org/docs/rules/no-path-concat
    'no-path-concat': 'warn',

    // disallow use of process.env
    'no-process-env': 'off',

    // disallow process.exit()
    'no-process-exit': 'off',

    // restrict usage of specified node modules
    'no-restricted-modules': 'off',

    // disallow use of synchronous methods (off by default)
    'no-sync': 'off',
       // enforce spacing inside array brackets
    'array-bracket-spacing': ['warn', 'never'],

    // enforce spacing inside single-line blocks
    // http://eslint.org/docs/rules/block-spacing
    'block-spacing': ['warn', 'always'],

    // enforce one true brace style
    'brace-style': ['warn', '1tbs', { allowSingleLine: true }],

    // require camel case names
    camelcase: ['warn', { properties: 'never' }],

    // enforce spacing before and after comma
    'comma-spacing': ['warn', { before: false, after: true }],

    // enforce one true comma style
    'comma-style': ['warn', 'last'],

    // disallow padding inside computed properties
    'computed-property-spacing': ['warn', 'never'],

    // enforces consistent naming when capturing the current execution context
    'consistent-this': 'off',

    // enforce newline at the end of file, with no multiple empty lines
    'eol-last': ['warn', 'always'],

    // enforce spacing between functions and their invocations
    // http://eslint.org/docs/rules/func-call-spacing
    'func-call-spacing': ['warn', 'never'],

    // requires function names to match the name of the variable or property to which they are
    // assigned
    // http://eslint.org/docs/rules/func-name-matching
    'func-name-matching': ['off', { includeCommonJSModuleExports: false }],

    // require function expressions to have a name
    // http://eslint.org/docs/rules/func-names
    'func-names': 'warn',

    // enforces use of function declarations or expressions
    // http://eslint.org/docs/rules/func-style
    // TODO: enable
    'func-style': ['off', 'expression'],

    // Blacklist certain identifiers to prevent them being used
    // http://eslint.org/docs/rules/id-blacklist
    'id-blacklist': 'off',

    // this option enforces minimum and maximum identifier lengths
    // (variable names, property names etc.)
    'id-length': 'off',

    // require identifiers to match the provided regular expression
    'id-match': 'off',

    // this option sets a specific tab width for your code
    // http://eslint.org/docs/rules/indent
    indent: ['off', 4, { SwitchCase: 1, VariableDeclarator: 1, outerIIFEBody: 1 }],

    // specify whether double or single quotes should be used in JSX attributes
    // http://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': ['off', 'prefer-double'],

    // enforces spacing between keys and values in object literal properties
    'key-spacing': ['warn', { beforeColon: false, afterColon: true }],

    // require a space before & after certain keywords
    'keyword-spacing': ['warn', {
      before: true,
      after: true,
      overrides: {
        return: { after: true },
        throw: { after: true },
        case: { after: true }
      }
    }],

    // enforce position of line comments
    // http://eslint.org/docs/rules/line-comment-position
    // TODO: enable?
    'line-comment-position': ['off', {
      position: 'above',
      ignorePattern: '',
      applyDefaultPatterns: true,
    }],

    // disallow mixed 'LF' and 'CRLF' as linebreaks
    // http://eslint.org/docs/rules/linebreak-style
    'linebreak-style': ['warn', 'unix'],

    // enforces empty lines around comments
    'lines-around-comment': 'off',

    // require or disallow newlines around directives
    // http://eslint.org/docs/rules/lines-around-directive
    'lines-around-directive': ['warn', {
      before: 'always',
      after: 'always',
    }],

    // specify the maximum depth that blocks can be nested
    'max-depth': ['off', 4],

    // specify the maximum length of a line in your program
    // http://eslint.org/docs/rules/max-len
    'max-len': ['warn', 100, 2, {
      ignoreUrls: true,
      ignoreComments: false,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
    }],

    // specify the max number of lines in a file
    // http://eslint.org/docs/rules/max-lines
    'max-lines': ['off', {
      max: 300,
      skipBlankLines: true,
      skipComments: true
    }],

    // specify the maximum depth callbacks can be nested
    'max-nested-callbacks': 'off',

    // limits the number of parameters that can be used in the function declaration.
    'max-params': ['off', 3],

    // specify the maximum number of statement allowed in a function
    'max-statements': ['off', 10],

    // restrict the number of statements per line
    // http://eslint.org/docs/rules/max-statements-per-line
    'max-statements-per-line': ['off', { max: 1 }],

    // require multiline ternary
    // http://eslint.org/docs/rules/multiline-ternary
    // TODO: enable?
    'multiline-ternary': ['off', 'never'],

    // require a capital letter for constructors
    'new-cap': ['warn', {
      newIsCap: true,
      newIsCapExceptions: [],
      capIsNew: false,
      capIsNewExceptions: ['Immutable.Map', 'Immutable.Set', 'Immutable.List'],
    }],

    // disallow the omission of parentheses when invoking a constructor with no arguments
    // http://eslint.org/docs/rules/new-parens
    'new-parens': 'warn',

    // allow/disallow an empty newline after var statement
    'newline-after-var': 'off',

    // http://eslint.org/docs/rules/newline-before-return
    'newline-before-return': 'off',

    // enforces new line after each method call in the chain to make it
    // more readable and easy to maintain
    // http://eslint.org/docs/rules/newline-per-chained-call
    'newline-per-chained-call': ['warn', { ignoreChainWithDepth: 4 }],

    // disallow use of the Array constructor
    'no-array-constructor': 'warn',

    // disallow use of bitwise operators
    // http://eslint.org/docs/rules/no-bitwise
    'no-bitwise': 'warn',

    // disallow use of the continue statement
    // http://eslint.org/docs/rules/no-continue
    'no-continue': 'warn',

    // disallow comments inline after code
    'no-inline-comments': 'off',

    // disallow if as the only statement in an else block
    // http://eslint.org/docs/rules/no-lonely-if
    'no-lonely-if': 'warn',

    // disallow un-paren'd mixes of different operators
    // http://eslint.org/docs/rules/no-mixed-operators
    'no-mixed-operators': ['warn', {
      groups: [
        ['+', '-', '*', '/', '%', '**'],
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof']
      ],
      allowSamePrecedence: false
    }],

    // disallow mixed spaces and tabs for indentation
    'no-mixed-spaces-and-tabs': 'warn',

    // disallow multiple empty lines and only one newline at the end
    'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],

    // disallow negated conditions
    // http://eslint.org/docs/rules/no-negated-condition
    'no-negated-condition': 'off',

    // disallow nested ternary expressions
    'no-nested-ternary': 'warn',

    // disallow use of the Object constructor
    'no-new-object': 'warn',

    // disallow use of unary operators, ++ and --
    // http://eslint.org/docs/rules/no-plusplus
    'no-plusplus': 'warn',

    // disallow certain syntax forms
    // http://eslint.org/docs/rules/no-restricted-syntax
    'no-restricted-syntax': [
      'warn',
      'ForInStatement',
      'ForOfStatement',
      'LabeledStatement',
      'WithStatement',
    ],

    // disallow space between function identifier and application
    'no-spaced-func': 'warn',

    // disallow tab characters entirely
    'no-tabs': 'off',

    // disallow the use of ternary operators
    'no-ternary': 'off',

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'warn',

    // disallow dangling underscores in identifiers
    'no-underscore-dangle': ['off', { allowAfterThis: false }],

    // disallow the use of Boolean literals in conditional expressions
    // also, prefer `a || b` over `a ? a : b`
    // http://eslint.org/docs/rules/no-unneeded-ternary
    'no-unneeded-ternary': ['warn', { defaultAssignment: false }],

    // disallow whitespace before properties
    // http://eslint.org/docs/rules/no-whitespace-before-property
    'no-whitespace-before-property': 'warn',

    // require padding inside curly braces
    'object-curly-spacing': ['warn', 'always'],

    // enforce line breaks between braces
    // http://eslint.org/docs/rules/object-curly-newline
    // TODO: enable once https://github.com/eslint/eslint/issues/6488 is resolved
    'object-curly-newline': ['off', {
      ObjectExpression: { minProperties: 0, multiline: true },
      ObjectPattern: { minProperties: 0, multiline: true }
    }],

    // enforce "same line" or "multiple line" on object properties.
    // http://eslint.org/docs/rules/object-property-newline
    'object-property-newline': ['warn', {
      allowMultiplePropertiesPerLine: true,
    }],

    // allow just one var statement per function
    'one-var': ['warn', 'never'],

    // require a newline around variable declaration
    // http://eslint.org/docs/rules/one-var-declaration-per-line
    'one-var-declaration-per-line': ['warn', 'always'],

    // require assignment operator shorthand where possible or prohibit it entirely
    // http://eslint.org/docs/rules/operator-assignment
    'operator-assignment': ['warn', 'always'],

    // enforce operators to be placed before or after line breaks
    'operator-linebreak': 'off',

    // enforce padding within blocks
    'padded-blocks': ['warn', 'never'],

    // require quotes around object literal property names
    // http://eslint.org/docs/rules/quote-props.html
    'quote-props': ['warn', 'as-needed', { keywords: false, unnecessary: true, numbers: false }],

    // specify whether double or single quotes should be used
    quotes: ['warn', 'single', { avoidEscape: true }],

    // do not require jsdoc
    // http://eslint.org/docs/rules/require-jsdoc
    'require-jsdoc': 'off',

    // require or disallow use of semicolons instead of ASI
    semi: ['warn', 'always'],

    // enforce spacing before and after semicolons
    'semi-spacing': ['warn', { before: false, after: true }],

    // requires object keys to be sorted
    'sort-keys': ['off', 'asc', { caseSensitive: false, natural: true }],

    // sort variables within the same declaration block
    'sort-vars': 'off',

    // require or disallow space before blocks
    'space-before-blocks': 'warn',

    // require or disallow space before function opening parenthesis
    // http://eslint.org/docs/rules/space-before-function-paren
    'space-before-function-paren': ['warn', {
      anonymous: 'always',
      named: 'never',
      asyncArrow: 'always'
    }],

    // require or disallow spaces inside parentheses
    'space-in-parens': ['warn', 'never'],

    // require spaces around operators
    'space-infix-ops': 'warn',

    // Require or disallow spaces before/after unary operators
    // http://eslint.org/docs/rules/space-unary-ops
    'space-unary-ops': ['warn', {
      words: true,
      nonwords: false,
      overrides: {
      },
    }],

    // require or disallow a space immediately following the // or /* in a comment
    'spaced-comment': ['warn', 'always', {
      exceptions: ['-', '+'],
      markers: ['=', '!']           // space here to support sprockets directives
    }],

    // require or disallow the Unicode Byte Order Mark
    // http://eslint.org/docs/rules/unicode-bom
    'unicode-bom': ['warn', 'never'],

    // require regex literals to be wrapped in parentheses
    'wrap-regex': 'off',
      // enforce or disallow variable initializations at definition
    'init-declarations': 'off',

    // disallow the catch clause parameter name being the same as a variable in the outer scope
    'no-catch-shadow': 'off',

    // disallow deletion of variables
    'no-delete-var': 'warn',

    // disallow labels that share a name with a variable
    // http://eslint.org/docs/rules/no-label-var
    'no-label-var': 'warn',

    // disallow specific globals
    'no-restricted-globals': 'off',

    // disallow declaration of variables already declared in the outer scope
    'no-shadow': 'warn',

    // disallow shadowing of names such as arguments
    'no-shadow-restricted-names': 'warn',

    // disallow use of undeclared variables unless mentioned in a /*global */ block
    'no-undef': 'warn',

    // disallow use of undefined when initializing variables
    'no-undef-init': 'warn',

    // disallow use of undefined variable
    // http://eslint.org/docs/rules/no-undefined
    // TODO: enable?
    'no-undefined': 'off',

    // disallow declaration of variables that are not used in the code
    'no-unused-vars': ['warn', { vars: 'local', args: 'after-used' }],

    // disallow use of variables before they are defined
    'no-use-before-define': 'warn',

    }
};