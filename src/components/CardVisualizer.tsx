
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Wifi, CreditCard, Square } from 'lucide-react'
import { detectCardType, cardTypes } from '../utils/cardValidation'

interface CardVisualizerProps {
  cardNumber: string
  cardholderName?: string
  expiryMonth?: string
  expiryYear?: string
  cvv?: string
  isValid?: boolean
}

export const CardVisualizer: React.FC<CardVisualizerProps> = ({
  cardNumber,
  cardholderName = 'NOME DO PORTADOR',
  expiryMonth = '12',
  expiryYear = '28',
  cvv = '123',
  isValid
}) => {
  const [showBack, setShowBack] = useState(false)
  const cardType = detectCardType(cardNumber)
  const maskedNumber = cardNumber 
    ? cardNumber.replace(/(.{4})/g, '$1 ').trim()
    : '•••• •••• •••• ••••'
  
  const getCardGradient = () => {
    if (!cardType) return 'from-blue-800 via-blue-900 to-blue-950'
    
    const govBrColors = {
      'visa': 'from-blue-700 via-blue-800 to-blue-900',
      'mastercard': 'from-green-700 via-green-800 to-green-900',
      'amex': 'from-gray-700 via-gray-800 to-gray-900',
      'discover': 'from-orange-700 via-orange-800 to-orange-900',
      'default': 'from-blue-800 via-blue-900 to-blue-950'
    }
    
    const baseColor = govBrColors[cardType.name.toLowerCase()] || govBrColors.default
    
    if (isValid === true) {
      return `${baseColor} ring-2 ring-green-400/50`
    } else if (isValid === false) {
      return `${baseColor} ring-2 ring-red-400/50`
    }
    
    return baseColor
  }

  const ChipIcon = () => (
    <div className="relative w-10 h-7 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded border border-yellow-600/50 shadow-sm">
      <div className="absolute inset-1 grid grid-cols-4 gap-px">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-yellow-700/60 rounded-[1px]" />
        ))}
      </div>
    </div>
  )

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className="relative w-full"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: showBack ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      >
        <motion.div
          className={`relative w-full aspect-[1.586/1] bg-gradient-to-br ${getCardGradient()} rounded-xl shadow-lg overflow-hidden`}
          style={{ 
            backfaceVisibility: 'hidden',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/3 rounded-full blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" 
                 style={{ 
                   backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)' 
                 }} 
            />
          </div>

          <div className="relative h-full flex flex-col justify-between p-4 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <ChipIcon />
                <Wifi size={20} className="text-white/80" />
              </div>
              
              {cardType && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="bg-white/10 px-3 py-1 rounded backdrop-blur-sm border border-white/20"
                >
                  <div className="text-sm font-semibold tracking-wide">
                    {cardTypes[cardType.name]?.name || 'CARTÃO'}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-3">
              <motion.div
                className="text-lg md:text-xl font-mono tracking-wider bg-white/10 p-2 rounded backdrop-blur-sm"
                animate={{ 
                  scale: cardNumber ? 1 : 0.95,
                  opacity: cardNumber ? 1 : 0.7 
                }}
              >
                {maskedNumber}
              </motion.div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
                  <div className="text-xs text-white/70 uppercase tracking-wide font-medium">Portador</div>
                  <div className="text-sm font-medium tracking-wide uppercase truncate">
                    {cardholderName}
                  </div>
                </div>
                
                <div className="bg-white/10 p-2 rounded backdrop-blur-sm">
                  <div className="text-xs text-white/70 uppercase tracking-wide font-medium">Validade</div>
                  <div className="text-sm font-mono font-medium">
                    {expiryMonth}/{expiryYear}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {isValid !== undefined && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${
                isValid 
                  ? 'bg-green-500/90 text-white' 
                  : 'bg-red-500/90 text-white'
              } backdrop-blur-sm`}
            >
              {isValid ? 'VÁLIDO' : 'INVÁLIDO'}
            </motion.div>
          )}
        </motion.div>

        <motion.div
          className={`absolute inset-0 w-full aspect-[1.586/1] bg-gradient-to-br ${getCardGradient()} rounded-xl shadow-lg overflow-hidden`}
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="w-full h-12 bg-black mt-4"></div>
          
          <div className="p-4 mt-6">
            <div className="bg-white rounded h-8 mb-4 flex items-center justify-end pr-3">
              <span className="text-black text-sm font-mono">{cvv}</span>
            </div>
            
            <div className="text-white space-y-2">
              <div className="text-xs bg-white/10 p-2 rounded backdrop-blur-sm">
                <div className="font-medium">CVC: {cvv}</div>
                <div className="text-white/70 mt-1">Código de Verificação do Cartão</div>
              </div>
              
              <div className="text-xs text-white/60 leading-relaxed">
                Este cartão é de propriedade do banco emissor e deve ser devolvido quando solicitado.
                O uso indevido constitui crime.
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.button
        onClick={() => setShowBack(!showBack)}
        className="mt-4 w-full px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg font-medium transition-colors duration-200 border border-blue-600"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {showBack ? 'Ver Frente' : 'Ver CVC'}
      </motion.button>
    </div>
  )
}

export default CardVisualizer
