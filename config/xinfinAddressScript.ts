import * as fs from 'fs'
import * as mustache from 'mustache'
import * as networkAddresses from '../networks/addresses.json'
import { Addresses } from './addresses.template'

// mustache doesn't like numbered object keys
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let renameAddresses: any = networkAddresses
renameAddresses['xinfin'] = networkAddresses['50']

export let addresses: Addresses = {
  Factory: '{{xinfin.Factory}}',
  blockNumber: '',
  network: '',
}

const main = (): void => {
  try {
    let output = JSON.parse(mustache.render(JSON.stringify(addresses), renameAddresses))
    output.blockNumber = '59000000'  // Block to start indexing from
    output.network = 'xinfin'
    fs.writeFileSync(__dirname + '/generatedAddresses.json', JSON.stringify(output, null, 2))
  } catch (e) {
    console.log(`Error saving artifacts: ${e.message}`)
  }
}

main()