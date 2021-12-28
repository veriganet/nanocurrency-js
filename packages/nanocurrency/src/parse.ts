/*!
 * nanocurrency-js: A toolkit for the Nano cryptocurrency.
 * Copyright (c) 2019 Marvin ROGER <dev at marvinroger dot fr>
 * Licensed under GPL-3.0 (https://git.io/vAZsK)
 */
import { blake2b } from 'blakejs'

import { compareArrays } from './utils'
import { checkString } from './check'
import { decodeNanoBase32 } from './nano-base32'

/** @hidden */
export interface ParseAddressResult {
  valid: boolean
  publicKeyBytes: Uint8Array | null
}

/** @hidden */
export function parseAddress(address: {}): ParseAddressResult {
  const invalid = { valid: false, publicKeyBytes: null }
  if (
    !checkString(address) ||
    !/^([a-z0-9]{3,4}_)[13][13-9a-km-uw-z]{59}$/.test(address as string)
  ) {
    return invalid
  }

  let prefixLength
  prefixLength = (address as string).split("_")[0].length+1

  const publicKeyBytes = decodeNanoBase32(
    (address as string).substr(prefixLength, 52)
  )
  const checksumBytes = decodeNanoBase32(
    (address as string).substr(prefixLength + 52)
  )

  const computedChecksumBytes = blake2b(publicKeyBytes, null, 5).reverse()

  const valid = compareArrays(checksumBytes, computedChecksumBytes)

  if (!valid) return invalid

  return {
    publicKeyBytes,
    valid: true,
  }
}
