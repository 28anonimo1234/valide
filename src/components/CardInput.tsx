
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CreditCard, Calendar, Shield } from 'lucide-react'
import { detectCardType, cardTypes } from '../utils/cardValidation'

interface CardInputProps {
  value: string
  onChange: (value: string) => void
  onValidate: () => void
  isValidating: boolean
  validationResult?: any
  onCardDataChange?: (data: {
    cardNumber: string
    expiryMonth: string
    expiryYear: string
    cvv: string
    cardholderName: string
  }) => void
}

export const CardInput: React.FC<CardInputProps> = ({
  value,
  onChange,
  onValidate,
  isValidating,
  validationResult,
  onCardDataChange
}) => {
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [cardholderName, setCardholderName] = useState('')

  const cardType = detectCardType(value)

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '')
    const formattedValue = rawValue.replace(/(.{4})/g, '$1 ').trim()
    onChange(rawValue)
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4)
    setCvv(value)
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2)
    if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 12)) {
      setExpiryMonth(value)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 2)
    setExpiryYear(value)
  }

  useEffect(() => {
    if (onCardDataChange) {
      onCardDataChange({
        cardNumber: value,
        expiryMonth,
        expiryYear,
        cvv,
        cardholderName
      })
    }
  }, [value, expiryMonth, expiryYear, cvv, cardholderName, onCardDataChange])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onValidate()
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Número do Cartão
        </label>
        <div className="relative">
          <CreditCard className="absolute left-3 top-3 h-5 w-5 text-blue-400" />
          <input
            type="text"
            value={value.replace(/(.{4})/g, '$1 ').trim()}
            onChange={handleCardNumberChange}
            onKeyPress={handleKeyPress}
            placeholder="0000 0000 0000 0000"
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            maxLength={19}
          />
          {cardType && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-3 top-3 text-sm text-blue-300 font-medium"
            >
              {cardTypes[cardType.name]?.name}
            </motion.div>
          )}
        </div>
      </div>

      <div className="relative">
        <label className="block text-sm font-medium text-white/90 mb-2">
          Nome do Portador
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
          placeholder="NOME COMPLETO"
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
        />
      </div>
      <label className="block text-sm font-medium text-white/90 mb-2">
          Validade
        </label>
      <div className="grid grid-cols-3 gap-4">
        <div className="relative">
          <label className="block text-sm font-medium text-white/90 mb-2">
            Mês
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <input
              type="text"
              value={expiryMonth}
              onChange={handleMonthChange}
              placeholder="MM"
              className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-center"
              maxLength={2}
            />
          </div>
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-white/90 mb-2">
            Ano
          </label>
          <input
            type="text"
            value={expiryYear}
            onChange={handleYearChange}
            placeholder="AA"
            className="w-full px-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-center"
            maxLength={2}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-white/90 mb-2">
            CVC
          </label>
          <div className="relative">
            <Shield className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              className="w-full pl-9 pr-3 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm text-center"
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {cardType && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-blue-300 bg-blue-900/20 p-3 rounded-lg border border-blue-500/30"
        >
          <CreditCard size={16} />
          <span>
            Cartão {cardTypes[cardType.name]?.name} detectado
          </span>
        </motion.div>
      )}
    </div>
  )
}

export default CardInput
