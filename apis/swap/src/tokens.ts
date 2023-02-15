import 'dotenv/config'

import { ChainId } from '@sushiswap/chain'
import {
  currencyFromShortCurrencyName,
  isShortCurrencyName,
  isShortCurrencyNameSupported,
  Token,
} from '@sushiswap/currency'
import { configureChains, createClient } from '@wagmi/core'
import { getAddress, isAddress } from 'ethers/lib/utils'
import fetch from 'node-fetch'
import { z } from 'zod'

import { allChains } from './chains'
import { allProviders } from './providers'

const { provider } = configureChains(allChains, allProviders)
createClient({
  autoConnect: true,
  provider,
})

const tokenSchema = z.object({
  address: z.coerce.string().transform((address) => address.toLowerCase()),
  symbol: z.string(),
  name: z.string(),
  decimals: z.coerce.number().int().gte(0),
})

const tokenCache: Map<ChainId, Map<string, typeof tokenSchema['_type']>> = new Map()
function getCache(chainId: ChainId, tokenId: string) {
  return tokenCache.get(chainId)?.get(tokenId.toLowerCase())
}
function setCache(chainId: ChainId, tokenId: string, token: typeof tokenSchema['_type']) {
  if (!tokenCache.get(chainId)) tokenCache.set(chainId, new Map())
  tokenCache.get(chainId)?.set(tokenId.toLowerCase(), token)
}

// ! Only Polygon tokens are currently pre-cached
async function populateCache() {
  const chainIds = [ChainId.POLYGON]

  for (const chainId of chainIds) {
    const tokens = z
      .array(tokenSchema)
      .parse(await fetch(`https://tokens.sushi.com/v0/${chainId}`).then((data) => data.json()))
    tokens.forEach((token) => setCache(chainId, token.address, token))
  }
}
populateCache()

// Currently unused, since the cache will be populated with all tokens
async function fetcher(chainId: ChainId, tokenId: string) {
  const cachedToken = getCache(chainId, tokenId)
  if (cachedToken) return cachedToken

  const token = tokenSchema.parse(
    await fetch(`https://tokens.sushi.com/v0/${chainId}/${getAddress(tokenId)}`).then((data) => data.json())
  )

  setCache(chainId, tokenId, token)

  return token
}

export async function getToken(chainId: ChainId, tokenId: string) {
  const isShortNameSupported = isShortCurrencyNameSupported(chainId)
  const tokenIdIsShortName = isShortCurrencyName(chainId, tokenId)

  // console.log({ isShortNameSupported, tokenIdIsShortName, tokenId })

  if (isShortNameSupported && tokenIdIsShortName) return currencyFromShortCurrencyName(chainId, tokenId)

  if (!isAddress(tokenId)) throw new Error(`Invalid token address: ${tokenId}`)

  // Fallback?
  // const { address, decimals, name, symbol } = await fetchToken({ address: getAddress(tokenId), chainId })

  return new Token({
    chainId,
    ...(await fetcher(chainId, tokenId)),
  })
}
