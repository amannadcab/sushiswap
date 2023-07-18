import { PlusCircleIcon } from '@heroicons/react/24/outline'
import { Protocol } from '@sushiswap/client'
import { useMutationObserver } from '@sushiswap/hooks'
import { Popover, PopoverContent, PopoverTrigger } from '@sushiswap/ui'
import { Chip, Separator } from '@sushiswap/ui'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@sushiswap/ui'
import { CommandList } from '@sushiswap/ui'
import { Label } from '@sushiswap/ui'
import { Button } from '@sushiswap/ui/components/button'
import { Command, CommandGroup, CommandItem } from '@sushiswap/ui/components/command'
import { CheckIcon } from '@sushiswap/ui/components/icons'
import React, { FC, useCallback, useMemo, useState } from 'react'

import { PROTOCOL_MAP } from '../../../../../lib/constants'
import { usePoolFilters } from '../../../PoolsFiltersProvider'

export const POOL_TYPES = [
  Protocol.SUSHISWAP_V3,
  Protocol.SUSHISWAP_V2,
  Protocol.BENTOBOX_STABLE,
  Protocol.BENTOBOX_CLASSIC,
]

const POOL_DESCRIPTIONS = {}

export const TableFiltersPoolType: FC = () => {
  const [open, setOpen] = useState(false)
  const { protocols, setFilters } = usePoolFilters()
  const [peekedProtocol, setPeekedProtocol] = React.useState<Protocol>(POOL_TYPES[0])

  const values = useMemo(() => (protocols.length === POOL_TYPES.length ? [] : protocols), [protocols])

  const protocolHandler = useCallback(
    (item: Protocol) => {
      const newProtocols = protocols?.includes(item)
        ? protocols.filter((el) => el !== item)
        : [...(protocols || []), item]

      setFilters({
        protocols: newProtocols.length === 0 ? undefined : newProtocols,
      })
    },
    [protocols, setFilters]
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          icon={PlusCircleIcon}
          aria-label="Select a protocol"
          variant="secondary"
          role="combobox"
          size="sm"
          aria-expanded={open}
        >
          <span>Type</span>
          {values?.length > 0 && (
            <>
              <Separator orientation="vertical" className="m-1 !h-4" />
              <Chip variant="secondary" className="lg:hidden">
                {values.length}
              </Chip>
              <div className="hidden lg:flex gap-1">
                {values.length > 2 ? (
                  <Chip variant="secondary">{values.length} selected</Chip>
                ) : (
                  POOL_TYPES.filter((option) => values.includes(option)).map((option) => (
                    <Chip variant="secondary" key={option}>
                      {PROTOCOL_MAP[option]}
                    </Chip>
                  ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="!w-[unset] !p-0">
        <HoverCard>
          <HoverCardContent side="left" align="start" forceMount>
            <div className="flex flex-col gap-2">
              <Label>{PROTOCOL_MAP[peekedProtocol]}</Label>
              <div className="text-sm text-muted-foreground">Test description</div>
            </div>
          </HoverCardContent>
          <Command className="flex items-center gap-1">
            <CommandList>
              <HoverCardTrigger />
              <CommandGroup>
                {POOL_TYPES.map((el) => (
                  <ProtocolItem
                    selected={values}
                    key={el}
                    protocol={el}
                    onPeek={(protocol) => setPeekedProtocol(protocol)}
                    onSelect={() => protocolHandler(el.toUpperCase() as Protocol)}
                  />
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </HoverCard>
      </PopoverContent>
    </Popover>
  )
}

interface ProtocolItemProps {
  protocol: Protocol
  onSelect: () => void
  selected: Protocol[]
  onPeek: (model: Protocol) => void
}

const ProtocolItem: FC<ProtocolItemProps> = ({ selected, protocol, onSelect, onPeek }) => {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes') {
        if (mutation.attributeName === 'aria-selected') {
          onPeek(protocol)
        }
      }
    }
  })

  return (
    <CommandItem ref={ref} key={protocol} value={protocol} onSelect={onSelect} className="py-2 pl-8 pr-2">
      {selected.includes(protocol) ? (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <CheckIcon strokeWidth={3} width={16} height={16} className="text-blue" />
        </span>
      ) : null}
      {PROTOCOL_MAP[protocol]}
    </CommandItem>
  )
}
