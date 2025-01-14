'use client'

import { useState, useEffect } from 'react'

const API_KEY = process.env.NEXT_PUBLIC_CURRENCY_API_KEY

export const useCurrencyConversion = (baseCurrency: string, targetCurrency: string) => {
  const [conversionRate, setConversionRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchConversionRate = async () => {
      if (baseCurrency === targetCurrency) {
        setConversionRate(1)
        setLoading(false)
        return
      }

      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}?api_key=${process.env.NEXT_PUBLIC_CURRENCY_API_KEY}`
        )
        const data = await response.json()
        if (data.rates && data.rates[targetCurrency]) {
          setConversionRate(data.rates[targetCurrency])
        } else {
          throw new Error('Invalid currency')
        }
      } catch (err) {
        setError('Failed to fetch conversion rate')
      } finally {
        setLoading(false)
      }
    }

    fetchConversionRate()
  }, [baseCurrency, targetCurrency])

  return { conversionRate, loading, error }
}

