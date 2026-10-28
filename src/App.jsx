import { useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import CartPage from './pages/CartPage.jsx'

function App() {
  const [cartItems, setCartItems] = useState([])
  const [currentPage, setCurrentPage] = useState('home')

  const addToCart = (product) => {
    setCartItems((current) => {
      const existingItem = current.find((item) => item.id === product.id)

      if (existingItem) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...current,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ]
    })

    setCurrentPage('home')
  }

  const updateQuantity = (productId, change) => {
    setCartItems((current) =>
      current.flatMap((item) => {
        if (item.id !== productId) return [item]

        const nextQuantity = item.quantity + change
        return nextQuantity <= 0 ? [] : [{ ...item, quantity: nextQuantity }]
      }),
    )
  }

  const removeFromCart = (productId) => {
    setCartItems((current) => current.filter((item) => item.id !== productId))
  }

  if (currentPage === 'cart') {
    return (
      <CartPage
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCloseCart={() => setCurrentPage('home')}
      />
    )
  }

  return (
    <HomePage
      cartItems={cartItems}
      onAddToCart={addToCart}
      onRemoveFromCart={removeFromCart}
      onUpdateQuantity={updateQuantity}
      onOpenCart={() => setCurrentPage('cart')}
    />
  )
}

export default App
