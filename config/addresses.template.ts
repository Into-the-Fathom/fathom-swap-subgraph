// AS compiler does not like interface
export class Addresses {
    Factory: string
    blockNumber: string
    network: string
  }
  
  // AS compiler does not like const
  export let addresses: Addresses = {
    Factory: '{{Factory}}',
    blockNumber: '{{blockNumber}}',
    network: '{{network}}'
  }