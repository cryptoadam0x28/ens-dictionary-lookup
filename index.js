const { kebabCase } = require('lodash')
const { filter } = require('lodash')
const {
  tokenIdFrom,
  normalizeDomainName,
  loadFromDictionary,
  includeWordsByLength,
  ENS,
} = require('./utils')

async function main() {
  const dictionaryName = process.argv[2]
  if (!dictionaryName) throw 'Unspecified dictionary filename'

  const words = loadFromDictionary(dictionaryName)

  return Promise.all(
    includeWordsByLength(words, { min: 3, max: 11 }).map((word) => {
      return new Promise(async (resolve, _reject) => {
        const domain = kebabCase(normalizeDomainName(word))
        const isAvailable = await ENS.available(tokenIdFrom(domain))
        resolve({ isAvailable, word, domain: `${domain}.eth` })
      })
    }),
  )
}

main()
  .then((domains) => {
    console.table(filter(domains, 'isAvailable'))
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
