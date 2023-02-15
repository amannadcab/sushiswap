'use client'

import { Transition } from '@headlessui/react'
import { shortenAddress } from '@sushiswap/format'
import React, { FC, useState } from 'react'

import { useSwapState } from './TradeProvider'
import { useTrade } from '../../lib/useTrade'
import { Skeleton } from '@sushiswap/ui/future/components/skeleton'
import { classNames } from '@sushiswap/ui'
import { warningSeverity, warningSeverityClassName } from '../../lib/warningSeverity'
import { TradeRoute } from './TradeRoute'
import { ZERO } from '@sushiswap/math'

export const TradeStats: FC = () => {
  const [open, setOpen] = useState(false)
  const { value, recipient } = useSwapState()
  const { isLoading, isFetching, data: trade } = useTrade()
  const loading = Boolean(isLoading && +value > 0) || isFetching

  return (
    <Transition
      show={+value > 0}
      enter="transition duration-300 ease-out"
      enterFrom="transform translate-y-[16px] opacity-0"
      enterTo="transform translate-y-0 opacity-100"
      leave="transition duration-300 ease-out"
      leaveFrom="transform translate-y-0 opacity-100"
      leaveTo="transform translate-y-[16px] opacity-0"
    >
      <div className="w-full px-3 flex flex-col gap-1">
        {/*<div className="flex justify-between items-center gap-2">*/}
        {/*  <span className="text-sm text-gray-700 dark:text-slate-400">Slippage tolerance</span>*/}
        {/*  <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">*/}
        {/*    {isLoading ? (*/}
        {/*      <Skeleton.Box className="h-4 py-0.5 w-[120px] rounded-md" />*/}
        {/*    ) : (*/}
        {/*      `${slippageTolerance === 'AUTO' ? '0.5' : slippageTolerance}%`*/}
        {/*    )}*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div className="flex justify-between items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-slate-400">Price Impact</span>
          <span
            className={classNames(
              warningSeverityClassName(warningSeverity(trade?.priceImpact)),
              'text-sm font-semibold text-gray-700 text-right dark:text-slate-400'
            )}
          >
            {isLoading ? (
              <Skeleton.Box className="h-4 py-0.5 w-[120px] rounded-md" />
            ) : (
              `${trade?.priceImpact?.lessThan(ZERO) ? '+' : '-'}${Math.abs(Number(trade?.priceImpact?.toFixed(2)))}%` ??
              'N/A'
            )}
          </span>
        </div>
        {/*<div className="flex justify-between items-center gap-2">*/}
        {/*  <span className="text-sm text-gray-700 dark:text-slate-400">Minimum received</span>*/}
        {/*  <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">*/}
        {/*    {loading ? (*/}
        {/*      <Skeleton.Text fontSize="text-sm" className="w-[120px]" />*/}
        {/*    ) : (*/}
        {/*      `${trade?.minAmountOut?.toSignificant(6) ?? '0.00'} ${token1.symbol}`*/}
        {/*    )}*/}
        {/*  </span>*/}
        {/*</div>*/}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Recipient</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? (
              <Skeleton.Text fontSize="text-sm" className="w-[120px]" />
            ) : recipient ? (
              shortenAddress(recipient)
            ) : (
              ''
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Network fee</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? <Skeleton.Text fontSize="text-sm" className="w-[120px]" /> : `~$${trade?.gasSpent ?? '0.00'}`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-slate-400">Smart order route</span>
          <span className="text-sm font-semibold text-gray-700 text-right dark:text-slate-400">
            {loading ? (
              <Skeleton.Text fontSize="text-sm" className="w-[120px]" />
            ) : (
              <button onClick={() => setOpen(true)} className="text-sm text-blue font-semibold">
                View
              </button>
            )}
            <TradeRoute trade={trade} open={open} setOpen={setOpen} />
          </span>
        </div>
        {/*<div className="h-[2px] bg-gray-200 dark:bg-slate-800 w-full my-3" />*/}
        {/*<div className="flex justify-between items-start gap-2">*/}
        {/*  <span className="font-medium text-gray-900 dark:text-slate-100 mt-px">Expected output</span>*/}
        {/*  <div className="flex flex-col justify-end">*/}
        {/*    <span className="text-xl text-right font-semibold text-gray-900 dark:text-slate-100">*/}
        {/*      {loading ? (*/}
        {/*        <Skeleton.Text fontSize="text-xl" className="w-[120px]" />*/}
        {/*      ) : (*/}
        {/*        `${trade?.amountOut?.toSignificant(6) ?? '0.00'} ${token1.symbol}`*/}
        {/*      )}*/}
        {/*    </span>*/}
        {/*    {recipient && (*/}
        {/*      <span className="text-xs font-medium text-gray-900 text-right dark:text-slate-100">*/}
        {/*        to: {shortenAddress(recipient)}*/}
        {/*      </span>*/}
        {/*    )}*/}
        {/*  </div>*/}
        {/*</div>*/}
        {/*<pre className="whitespace-pre-wrap mt-3 p-3 dark:bg-slate-800 bg-white rounded-xl">*/}
        {/*  {trade?.currentRouteHumanString}*/}
        {/*</pre>*/}
      </div>
    </Transition>
  )
}
