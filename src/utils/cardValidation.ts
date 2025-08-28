
// Utilitários avançados para validação de cartão de crédito
export interface CardValidationResult {
  isValid: boolean
  cardType: string
  errors: string[]
  details: {
    luhnValid: boolean
    lengthValid: boolean
    formatValid: boolean
  }
}

export interface CardType {
  name: string
  pattern: RegExp
  lengths: number[]
  cvvLength: number
  format: RegExp
  color: string
  icon: string
}

// Definições de tipos de cartão com padrões específicos
export const cardTypes: Record<string, CardType> = {
  visa: {
    name: 'Visa',
    pattern: /^4/,
    lengths: [13, 16, 19],
    cvvLength: 3,
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
    color: 'from-blue-600 to-blue-800',
    icon: '💳'
  },
  mastercard: {
    name: 'Mastercard', 
    pattern: /^5[1-5]|^2[2-7]/,
    lengths: [16],
    cvvLength: 3,
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
    color: 'from-red-600 to-red-800',
    icon: '💳'
  },
  amex: {
    name: 'American Express',
    pattern: /^3[47]/,
    lengths: [15],
    cvvLength: 4,
    format: /(\d{4})(\d{6})(\d{5})/,
    color: 'from-green-600 to-green-800',
    icon: '💳'
  },
  discover: {
    name: 'Discover',
    pattern: /^6(?:011|5)/,
    lengths: [16],
    cvvLength: 3,
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
    color: 'from-orange-600 to-orange-800',
    icon: '💳'
  },
  diners: {
    name: 'Diners Club',
    pattern: /^3[068]/,
    lengths: [14],
    cvvLength: 3,
    format: /(\d{4})(\d{6})(\d{4})/,
    color: 'from-purple-600 to-purple-800',
    icon: '💳'
  },
  jcb: {
    name: 'JCB',
    pattern: /^35/,
    lengths: [16],
    cvvLength: 3,
    format: /(\d{4})(\d{4})(\d{4})(\d{4})/,
    color: 'from-indigo-600 to-indigo-800',
    icon: '💳'
  }
}

// Detectar tipo de cartão baseado no número
export const detectCardType = (cardNumber: string): CardType | null => {
  const cleanNumber = cardNumber.replace(/\D/g, '')
  
  for (const [key, cardType] of Object.entries(cardTypes)) {
    if (cardType.pattern.test(cleanNumber)) {
      return { ...cardType, name: key }
    }
  }
  
  return null
}

// Algoritmo de Luhn para validação
export const validateLuhn = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\D/g, '')
  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i])

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

// Formatação automática do número do cartão
export const formatCardNumber = (value: string): string => {
  const cleanValue = value.replace(/\D/g, '')
  const cardType = detectCardType(cleanValue)
  
  if (!cardType) {
    // Formato padrão 4-4-4-4
    return cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }

  if (cardType.name === 'amex') {
    // American Express: 4-6-5
    return cleanValue.replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim()
  } else if (cardType.name === 'diners') {
    // Diners: 4-6-4
    return cleanValue.replace(/(\d{4})(\d{6})(\d{4})/, '$1 $2 $3').trim()
  } else {
    // Outros: 4-4-4-4
    return cleanValue.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
  }
}

// Validação completa do cartão
export const validateCard = (cardNumber: string): CardValidationResult => {
  const cleanNumber = cardNumber.replace(/\D/g, '')
  const cardType = detectCardType(cleanNumber)
  const errors: string[] = []

  // Verificar se o número está vazio
  if (!cleanNumber) {
    errors.push('Número do cartão é obrigatório')
    return {
      isValid: false,
      cardType: 'unknown',
      errors,
      details: {
        luhnValid: false,
        lengthValid: false,
        formatValid: false
      }
    }
  }

  // Verificar comprimento
  const lengthValid = cardType ? cardType.lengths.includes(cleanNumber.length) : false
  if (!lengthValid) {
    errors.push('Comprimento do número do cartão inválido')
  }

  // Verificar algoritmo de Luhn
  const luhnValid = validateLuhn(cleanNumber)
  if (!luhnValid) {
    errors.push('Número do cartão inválido (falha na verificação Luhn)')
  }

  // Verificar formato básico
  const formatValid = /^\d+$/.test(cleanNumber)
  if (!formatValid) {
    errors.push('Formato do número do cartão inválido')
  }

  return {
    isValid: errors.length === 0,
    cardType: cardType?.name || 'unknown',
    errors,
    details: {
      luhnValid,
      lengthValid,
      formatValid
    }
  }
}

// Validar data de expiração
export const validateExpiryDate = (month: string, year: string): boolean => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  const expMonth = parseInt(month)
  const expYear = parseInt(year)

  if (expMonth < 1 || expMonth > 12) return false
  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false

  return true
}

// Validar CVV
export const validateCVV = (cvv: string, cardType?: string): boolean => {
  const cleanCVV = cvv.replace(/\D/g, '')
  
  if (cardType === 'amex') {
    return cleanCVV.length === 4
  } else {
    return cleanCVV.length === 3
  }
}

// Mascarar número do cartão para segurança
export const maskCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\D/g, '')
  const cardType = detectCardType(cleanNumber)
  
  if (cardType?.name === 'amex') {
    // American Express: mostrar primeiros 4 e últimos 5
    return `**** ****** *${cleanNumber.slice(-4)}`
  } else {
    // Outros: mostrar últimos 4
    return `**** **** **** ${cleanNumber.slice(-4)}`
  }
}
