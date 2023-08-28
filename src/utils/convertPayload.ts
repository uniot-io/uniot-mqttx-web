interface CodeType {
  encode: (str: string) => string
  decode: (str: string) => string
}

const convertBase64 = (value: string, codeType: 'encode' | 'decode'): string => {
  const convertMap: CodeType = {
    encode(str: string): string {
      return window.btoa(str)
    },
    decode(str: string): string {
      return window.atob(str)
    },
  }
  return convertMap[codeType](value)
}

const convertHex = (value: string, codeType: 'encode' | 'decode'): string => {
  const convertMap: CodeType = {
    encode(str: string): string {
      return Buffer.from(str, 'utf-8').toString('hex')
    },
    decode(str: string): string {
      return Buffer.from(str, 'hex').toString('utf-8')
    },
  }
  return convertMap[codeType](value)
}

const convertJSON = (value: string): [string, Error?] => {
  try {
    let $json = JSON.parse(value)
    $json = JSON.stringify($json, null, 2)
    return [$json, undefined]
  } catch (error) {
    return [value, error as Error]
  }
}

const convertPayload = (payload: string, currentType: PayloadType, fromType: PayloadType): [string, Error?] => {
  let $payload = payload
  let $error = undefined
  switch (fromType) {
    case 'Base64':
      $payload = convertBase64(payload, 'decode')
      break
    case 'Hex':
      $payload = convertHex(payload, 'decode')
      break
  }
  if (currentType === 'Base64') {
    $payload = convertBase64($payload, 'encode')
  }
  if (currentType === 'JSON' || currentType === 'CBOR') {
    [$payload, $error] = convertJSON($payload)
  }
  if (currentType === 'Hex') {
    $payload = convertHex($payload, 'encode')
  }
  return [$payload, $error]
}

export default convertPayload
