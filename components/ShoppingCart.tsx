import React, { useState } from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAppContext } from '@/lib/context/AppContext';
import Image from 'next/image';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// Inicializa Mercado Pago con tu clave pública
initMercadoPago('TU_CLAVE_PUBLICA_DE_MERCADO_PAGO');

export function ShoppingCartComponent() {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, removeFromCart } = useAppContext();
  const [preferenceId, setPreferenceId] = useState<string | null>(null);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: cart }),
      });
      const data = await response.json();
      setPreferenceId(data.id);
    } catch (error) {
      console.error('Error al crear la preferencia:', error);
    }
  };

  return (
    <div className="relative">
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="fixed top-4 right-4 z-50 bg-yellow-400 hover:bg-yellow-500 text-black"
      >
        <ShoppingCart className="mr-2 h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {totalItems}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className="fixed top-16 right-4 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4">
          <Button onClick={() => setIsOpen(false)} variant="ghost" size="icon" className="absolute top-2 right-2">
            <X className="h-4 w-4" />
          </Button>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Tu Carrito</h2>
          {cart.length === 0 ? (
            <p className="text-gray-600">Tu carrito está vacío</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center mb-4 bg-gray-100 p-2 rounded">
                  <Image src={item.image} alt={item.name} width={50} height={50} className="rounded mr-4" />
                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-600">${Number(item.price).toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <div className="flex items-center">
                    <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)} className="bg-red-100 text-red-600 hover:bg-red-200">
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2 font-semibold">{item.quantity}</span>
                    <Button variant="outline" size="icon" onClick={() => addToCart(item)} className="bg-green-100 text-green-600 hover:bg-green-200">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-2 border-t border-gray-200">
                <p className="font-bold text-xl text-gray-800">Total: ${totalPrice.toFixed(2)}</p>
                <Button onClick={() => alert('¡Gracias por tu compra!' )} className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                  Proceder al pago
                </Button>
                {preferenceId && <Wallet initialization={{ preferenceId }} />}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
