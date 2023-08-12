import { Container } from '@sushiswap/ui'
import { SimpleSwapWidget } from 'ui/swap/simple/simple-swap-widget'

import { Providers } from './providers'

export const metadata = {
  title: 'SushiSwap Simple',
}

export default function SwapSimplePage() {
  return (
    <Providers>
      <Container maxWidth="lg" className="px-4">
        <SimpleSwapWidget />
      </Container>
    </Providers>
  )
}
