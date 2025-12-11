'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'
import { ShoppingCart, Check, Loader2 } from 'lucide-react'

export default function OrderButton({ 
  productName = "Handmade Ceramic Mug",
  price = 45.00,
  isAvailable = true,
  onOrderPlace = () => {},
  disabled = false
}) {
  const [isOrdering, setIsOrdering] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)

  const handleOrder = async () => {
    if (disabled || !isAvailable) return

    setIsOrdering(true)
    
    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      setOrderComplete(true)
      onOrderPlace({
        productName,
        price,
        timestamp: new Date().toISOString()
      })
      
      // Reset after success message
      setTimeout(() => {
        setOrderComplete(false)
        setIsOrdering(false)
      }, 3000)
    } catch (error) {
      console.error('Order failed:', error)
      setIsOrdering(false)
    }
  }

  const getButtonContent = () => {
    if (orderComplete) {
      return (
        <>
          <Check className="mr-2 h-4 w-4" />
          Order Placed!
        </>
      )
    }
    
    if (isOrdering) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      )
    }
    
    if (!isAvailable) {
      return 'Out of Stock'
    }
    
    return (
      <>
        <ShoppingCart className="mr-2 h-4 w-4" />
        Order Now - ${price}
      </>
    )
  }

  const getButtonVariant = () => {
    if (orderComplete) return 'default'
    if (!isAvailable || disabled) return 'outline'
    return 'default'
  }

  const getButtonClass = () => {
    if (orderComplete) return 'bg-green-600 hover:bg-green-700'
    if (!isAvailable || disabled) return 'opacity-50 cursor-not-allowed'
    return 'bg-orange-600 hover:bg-orange-700'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{productName}</CardTitle>
          <CardDescription>
            {isAvailable ? 'Ready to order' : 'Currently unavailable'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-gray-900">
              ${price.toFixed(2)}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              isAvailable 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              {isAvailable ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>
          
          <Button
            onClick={handleOrder}
            disabled={isOrdering || orderComplete || !isAvailable || disabled}
            className={`w-full ${getButtonClass()}`}
            variant={getButtonVariant()}
          >
            {getButtonContent()}
          </Button>
          
          {orderComplete && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-green-600 text-center mt-2"
            >
              Thank you for your order! You'll receive a confirmation email shortly.
            </motion.p>
          )}
          
          {!isAvailable && (
            <p className="text-sm text-gray-500 text-center mt-2">
              This item is currently out of stock. Check back soon!
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}