
import React, { useState } from 'react'
import { Toaster } from 'react-hot-toast'
import { motion } from 'framer-motion'
import { Shield, Zap, Database, Eye } from 'lucide-react'
import CardInput from './components/CardInput'
import CardVisualizer from './components/CardVisualizer'
import ValidationHistory from './components/ValidationHistory'
import { useCardValidation } from './hooks/useCardValidation'

function App() {
  const [cardNumber, setCardNumber] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [cardData, setCardData] = useState({
    cardNumber: '',
    expiryMonth: '12',
    expiryYear: '28',
    cvv: '123',
    cardholderName: 'NOME DO PORTADOR'
  })
  
  const {
    validationResult,
    isValidating,
    validateCardNumber,
    validationHistory,
    fetchValidationHistory
  } = useCardValidation()

  const handleValidate = () => {
    if (cardNumber.trim()) {
      validateCardNumber(cardNumber)
    }
  }

  const handleCardDataChange = (data: any) => {
    setCardData(data)
  }

  const svgPattern = `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232563eb' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E`

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#5b74c7ff',
            color: '#fff',
            borderRadius: '8px',
            padding: '16px',
            fontSize: '14px',
            border: '1px solid #3b82f6'
          },
          success: {
            style: {
              background: '#059669',
              border: '1px solid #10b981'
            },
          },
          error: {
            style: {
              background: '#dc2626',
              border: '1px solid #ef4444'
            },
          },
        }}
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
        <div 
          className="absolute inset-0 opacity-30" 
          style={{ backgroundImage: `url("${svgPattern}")` }}
        />
        
        <div className="relative z-10">
          <motion.header
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-8 pb-6 border-b border-blue-700/30"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center">
                <motion.div
                  className="inline-flex items-center space-x-4 mb-4"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="p-3 bg-blue-600 rounded-lg shadow-lg">
                    <Shield size={32} className="text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className="text-3xl font-bold text-white">
                      Valide seu cartão!
                    </h1>
                    <p className="text-blue-200 text-sm">Sistema Oficial de Validação</p>
                  </div>
                </motion.div>
                
                <p className="text-lg text-blue-100 max-w-3xl mx-auto leading-relaxed">
                  Ferramenta oficial para validação de cartões de crédito e débito, 
                  detecção automática de bandeira e registro completo de histórico
                </p>

                <div className="flex justify-center space-x-8 mt-6">
                  {[
                    { icon: Zap, text: 'Validação Segura' },
                    { icon: Database, text: 'Histórico Oficial' },
                    { icon: Eye, text: 'Visualização Completa' }
                  ].map(({ icon: Icon, text }, index) => (
                    <motion.div
                      key={text}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center space-x-2 text-blue-200 bg-blue-800/30 px-4 py-2 rounded-lg border border-blue-600/30"
                    >
                      <Icon size={18} className="text-blue-300" />
                      <span className="text-sm font-medium">{text}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.header>

          <main className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-blue-600/30 shadow-xl">
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
                    <Shield size={20} className="text-blue-300" />
                    <span>Dados do Cartão</span>
                  </h2>
                  
                  <CardInput
                    value={cardNumber}
                    onChange={setCardNumber}
                    onValidate={handleValidate}
                    isValidating={isValidating}
                    validationResult={validationResult}
                    onCardDataChange={handleCardDataChange}
                  />

                  <motion.button
                    onClick={handleValidate}
                    disabled={isValidating || !cardNumber.trim()}
                    className="w-full mt-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border border-blue-500 shadow-lg"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    {isValidating ? 'Validando...' : 'Validar Cartão'}
                  </motion.button>
                </div>

                {validationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 rounded-lg border-2 shadow-lg ${
                      validationResult.isValid 
                        ? 'bg-green-600/20 border-green-500 text-green-100' 
                        : 'bg-red-600/20 border-red-500 text-red-100'
                    }`}
                  >
                    <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                      <span>{validationResult.isValid ? '✅' : '❌'}</span>
                      <span>{validationResult.isValid ? 'Cartão Válido' : 'Cartão Inválido'}</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="text-sm">
                        <span className="font-medium">Tipo:</span> {validationResult.cardType}
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Algoritmo Luhn', valid: validationResult.details.luhnValid },
                          { label: 'Comprimento', valid: validationResult.details.lengthValid },
                          { label: 'Formato', valid: validationResult.details.formatValid }
                        ].map(({ label, valid }) => (
                          <div key={label} className={`text-center p-3 rounded border ${
                            valid 
                              ? 'bg-green-500/20 border-green-400/50 text-green-200' 
                              : 'bg-red-500/20 border-red-400/50 text-red-200'
                          }`}>
                            <div className="font-medium text-xs">{label}</div>
                            <div className="text-xs mt-1">{valid ? 'Válido' : 'Inválido'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col items-center space-y-6"
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6 border border-blue-600/30 shadow-xl w-full">
                  <h2 className="text-xl font-semibold text-white mb-4 text-center flex items-center justify-center space-x-2">
                    <Eye size={20} className="text-blue-300" />
                    <span>Visualização do Cartão</span>
                  </h2>
                  
                  <CardVisualizer
                    cardNumber={cardNumber}
                    cardholderName={cardData.cardholderName}
                    expiryMonth={cardData.expiryMonth}
                    expiryYear={cardData.expiryYear}
                    cvv={cardData.cvv}
                    isValid={validationResult?.isValid}
                  />
                </div>

                <motion.button
                  onClick={() => setShowHistory(!showHistory)}
                  className="px-6 py-3 bg-blue-700/50 backdrop-blur-lg text-white rounded-lg border border-blue-600/50 hover:bg-blue-600/50 transition-all duration-200 font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {showHistory ? 'Ocultar Histórico' : 'Ver Histórico Oficial'}
                </motion.button>
              </motion.div>
            </div>

            {showHistory && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8"
              >
                <ValidationHistory
                  validationHistory={validationHistory}
                  onFetchHistory={fetchValidationHistory}
                />
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}

export default App
