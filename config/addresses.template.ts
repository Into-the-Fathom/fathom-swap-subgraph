// AS compiler does not like interface
export class Addresses {
    Factory: string
    Farm: string
    blockNumber: string
    network: string
  }
  
  // AS compiler does not like const
  export let addresses: Addresses = {
    Factory: '{{Factory}}',
    Farm: '{{Farm}}',
    blockNumber: '{{blockNumber}}',
    network: '{{network}}'
  }