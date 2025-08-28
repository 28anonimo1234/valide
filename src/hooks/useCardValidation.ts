
import { useState, useCallback } from 'react'
import { lumi } from '../lib/lumi'
import { validateCard, maskCardNumber, CardValidationResult } from '../utils/cardValidation'
import toast from 'react-hot-toast'

interface UseCardValidationReturn {
  validationResult: CardValidationResult | null
  isValidating: boolean
  validateCardNumber: (cardNumber: string) => Promise<void>
  saveValidation: (cardNumber: string, result: CardValidationResult) => Promise<void>
  validationHistory: any[]
  fetchValidationHistory: () => Promise<void>
}

export const useCardValidation = (): UseCardValidationReturn => {
  const [validationResult, setValidationResult] = useState<CardValidationResult | null>(null)
  const [isValidating, setIsValidating] = useState(false)
  const [validationHistory, setValidationHistory] = useState<any[]>([])

  const validateCardNumber = useCallback(async (cardNumber: string) => {
    setIsValidating(true)
    
    try {
      // Simular delay para efeito visual
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const result = validateCard(cardNumber)
      setValidationResult(result)
      
      if (result.isValid) {
        toast.success('Cartão válido! ✅')
      } else {
        toast.error('Cartão inválido ❌')
      }
      
      // Salvar validação automaticamente
      await saveValidation(cardNumber, result)
      
    } catch (error) {
      console.error('Erro na validação:', error)
      toast.error('Erro ao validar cartão')
    } finally {
      setIsValidating(false)
    }
  }, [])

  const saveValidation = useCallback(async (cardNumber: string, result: CardValidationResult) => {
    try {
      const maskedNumber = maskCardNumber(cardNumber)
      
      await lumi.entities.card_validations.create({
        cardNumber: maskedNumber,
        cardType: result.cardType,
        isValid: result.isValid,
        validationDetails: result.details,
        ipAddress: '192.168.1.1', // Em produção, obter IP real
        userAgent: navigator.userAgent,
        creator: 'card-checker',
        validatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      
      // Atualizar histórico
      await fetchValidationHistory()
      
    } catch (error) {
      console.error('Erro ao salvar validação:', error)
    }
  }, [])

  const fetchValidationHistory = useCallback(async () => {
    try {
      const { list } = await lumi.entities.card_validations.list()
      setValidationHistory(list.slice(0, 10)) // Últimas 10 validações
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
    }
  }, [])

  return {
    validationResult,
    isValidating,
    validateCardNumber,
    saveValidation,
    validationHistory,
    fetchValidationHistory
  }
}
