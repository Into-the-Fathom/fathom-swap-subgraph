/* eslint-disable prefer-const */
import { log } from '@graphprotocol/graph-ts'
import { LogPoolAdded, LogPoolAllocationUpdate, LogPoolRewardUpdate, LogDeposit, LogWithdraw, LogRewardPaid } from '../types/Farm/Farm'
import { LpPool, LpStake, Token } from '../types/schema'
import {
  fetchTokenDecimals,
  fetchTokenName,
  fetchTokenSymbol,
  fetchTokenTotalSupply,
  ZERO_BI,
  ZERO_BD
} from './helpers'

export function handleNewPool(event: LogPoolAdded): void {
  let pool = LpPool.load(event.params.lpToken.toHexString());

  if (pool === null) {

    let lpToken = Token.load(event.params.lpToken.toHexString());
    if (lpToken == null) {
      lpToken = new Token(event.params.lpToken.toHexString())
      lpToken.symbol = fetchTokenSymbol(event.params.lpToken)
      lpToken.name = fetchTokenName(event.params.lpToken)
      lpToken.totalSupply = fetchTokenTotalSupply(event.params.lpToken)
      let decimals = fetchTokenDecimals(event.params.lpToken)

      // bail if we couldn't figure out the decimals
      if (decimals === null) {
        log.info('LpToken decimals is null', [])
        return
      }

      lpToken.decimals = decimals
      lpToken.derivedETH = ZERO_BD
      lpToken.tradeVolume = ZERO_BD
      lpToken.tradeVolumeUSD = ZERO_BD
      lpToken.untrackedVolumeUSD = ZERO_BD
      lpToken.totalLiquidity = ZERO_BD
      lpToken.txCount = ZERO_BI

      lpToken.save();
    }

    pool = new LpPool(event.params.lpToken.toHexString());
    pool.allocPoint = event.params.allocPoint;
    pool.accRewardPerShare = ZERO_BI;
    pool.lpToken = event.params.lpToken.toHexString();
    pool.lastRewardBlock = event.block.number;

    pool.save();
  } else {
    log.info('Pool with id {} Found', [pool.id])
  }
}

export function handleAllocationUpdate(event: LogPoolAllocationUpdate): void {
  let pool = LpPool.load(event.params.lpToken.toHexString())
  if (pool === null) {
    log.info('Pool with id {} not Found', [event.params.lpToken.toHexString()])
  } else {
    pool.allocPoint = event.params.allocPoint;
    pool.save();
  }
}

export function handlePoolRewardUpdate(event: LogPoolRewardUpdate): void {
  let pool = LpPool.load(event.params.lpToken.toHexString())
  if (pool === null) {
    log.info('Pool with id {} not Found', [event.params.lpToken.toHexString()])
  } else {
    pool.accRewardPerShare = event.params.accRewardPerShare;
    pool.lastRewardBlock = event.params.lastRewardBlock;
    pool.save();
  }
}

export function handleDeposit(event: LogDeposit): void {
  let id = event.params.lpToken.toHexString().concat("-").concat(event.params.user.toHexString());

  let stake = LpStake.load(id);
  if (stake === null) {
    stake = new LpStake(id);
    stake.user = event.params.user.toHexString();
    stake.lpToken = event.params.lpToken.toHexString();
    stake.amount = event.params.amount;
    stake.rewardPaid = ZERO_BI;
  } else {
    stake.amount = stake.amount.plus(event.params.amount);
  }

  stake.save();
}

export function handleWithdraw(event: LogWithdraw): void {
  let id = event.params.lpToken.toHexString().concat("-").concat(event.params.user.toHexString());

  let stake = LpStake.load(id);
  if (stake === null) {
    log.info('Stake with id {} not Found', [id])
  } else {
    stake.amount = stake.amount.minus(event.params.amount);
    stake.save();
  }
}


export function handleRewardPaid(event: LogRewardPaid): void {
  let id = event.params.lpToken.toHexString().concat("-").concat(event.params.user.toHexString());

  let stake = LpStake.load(id);
  if (stake === null) {
    log.info('Stake with id {} not Found', [id])
  } else {
    stake.rewardPaid = stake.rewardPaid.plus(event.params.reward);
    stake.save();
  }
}

