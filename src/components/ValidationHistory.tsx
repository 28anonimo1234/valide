
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle, XCircle, Filter, Trash2 } from 'lucide-react'
import { cardTypes } from '../utils/cardValidation'

interface ValidationHistoryProps {
  validationHistory: any[]
  onFetchHistory: () => void
}

export const ValidationHistory: React.FC<ValidationHistoryProps> = ({
  validationHistory,
  onFetchHistory
}) => {
  const [filter, setFilter] = useState<'all' | 'valid' | 'invalid'>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    onFetchHistory()
  }, [onFetchHistory])

  const filteredHistory = validationHistory.filter(item => {
    const statusMatch = filter === 'all' || 
      (filter === 'valid' && item.isValid) || 
      (filter === 'invalid' && !item.isValid)
    
    const typeMatch = typeFilter === 'all' || item.cardType === typeFilter
    
    return statusMatch && typeMatch
  })

  const getCardTypeColor = (cardType: string) => {
    return cardTypes[cardType]?.color || 'from-gray-400 to-gray-600'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-800">Histórico de Validações</h3>
        <div className="flex items-center space-x-3">
          {/* Filtro por status */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Todos</option>
            <option value="valid">Válidos</option>
            <option value="invalid">Inválidos</option>
          </select>

          {/* Filtro por tipo */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border rounded-lg text-sm"
          >
            <option value="all">Todas as bandeiras</option>
            {Object.entries(cardTypes).map(([key, type]) => (
              <option key={key} value={key}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {filteredHistory.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-gray-500"
            >
              <Filter size={48} className="mx-auto mb-3 opacity-50" />
              <p>Nenhuma validação encontrada</p>
            </motion.div>
          ) : (
            filteredHistory.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  {/* Status Icon */}
                  <div className={`p-2 rounded-full ${
                    item.isValid ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {item.isValid ? (
                      <CheckCircle size={20} className="text-green-600" />
                    ) : (
                      <XCircle size={20} className="text-red-600" />
                    )}
                  </div>

                  {/* Card Info */}
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg">{item.cardNumber}</span>
                      <div className={`px-2 py-1 rounded text-xs text-white bg-gradient-to-r ${getCardTypeColor(item.cardType)}`}>
                        {cardTypes[item.cardType]?.name || item.cardType}
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-1" />
                      {formatDate(item.validatedAt)}
                    </div>
                  </div>
                </div>

                {/* Validation Details */}
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.validationDetails.luhnValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        Luhn
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.validationDetails.lengthValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        Comprimento
                      </span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        item.validationDetails.formatValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        Formato
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Estatísticas */}
      {validationHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 pt-6 border-t border-gray-200"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{validationHistory.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {validationHistory.filter(item => item.isValid).length}
              </div>
              <div className="text-sm text-gray-500">Válidos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {validationHistory.filter(item => !item.isValid).length}
              </div>
              <div className="text-sm text-gray-500">Inválidos</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ValidationHistory
