require('dotenv/config')

const fs = require('fs')
const {
  utils,
  BigNumber,
  providers: { InfuraProvider },
  Contract,
} = require('ethers')

const loadFromDictionary = (filename) => {
  return fs.readFileSync(`./dict/${filename}`).toString().split(/\n/)
}

const includeWordsByLength = (words, { min, max }) => {
  return words.filter((word) => word.length > min && word.length <= max)
}

const normalizeDomainName = (name) => {
  return name
    .replace(/-/g, '')
    .replace(/&/g, '')
    .replace(/\./g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]/gi, '')
    .toLowerCase()
}

const tokenIdFrom = (name) => {
  const labelHash = utils.keccak256(utils.toUtf8Bytes(name))
  return BigNumber.from(labelHash).toString()
}

class EthereumNameServiceContract extends Contract {
  constructor(provider) {
    super(
      '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
      ['function available(uint256 id) view returns(bool)'],
      provider,
    )
  }
}

module.exports = {
  loadFromDictionary,
  includeWordsByLength,
  normalizeDomainName,
  tokenIdFrom,
  ENS: new EthereumNameServiceContract(
    new InfuraProvider('homestead', process.env['INFURA_KEY']),
  ),
}
