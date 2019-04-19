const schema = `
type PasswordValidationResult {
  errors: [String]!
  failedTests: [Int]!
  passedTests: [Int]!
  requiredTestErrors: [String]!
  optionalTestErrors: [String]!
  isPassphrase: Boolean!
  strong: Boolean!
  optionalTestsPassed: Int!
}
`

const resolver = {}

exports.schema = schema
exports.resolver = resolver
