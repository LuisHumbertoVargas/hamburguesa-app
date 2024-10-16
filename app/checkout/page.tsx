"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/lib/context/AppContext';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Lottie from 'lottie-react';
import successAnimation from '@/public/success-animation.json';

export default function CheckoutPage() {
  const { cart, clearCart, user } = useAppContext();
  const router = useRouter();
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentInfo({ ...paymentInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast.error('Por favor, inicia sesión para continuar');
      router.push('/login');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          amount: totalAmount,
          ...paymentInfo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowSuccessAnimation(true);
        const orderNumber = Math.floor(1000 + Math.random() * 9000); // Genera un número de orden aleatorio
        const waitTime = Math.floor(15 + Math.random() * 16); // Tiempo de espera entre 15 y 30 minutos

        toast.success(
          <div>
            <h2>¡Pago procesado con éxito!</h2>
            <p>Número de orden: {orderNumber}</p>
            <p>Tiempo de espera aproximado: {waitTime} minutos</p>
          </div>,
          {
            autoClose: 5000,
            onClose: () => {
              clearCart();
              router.push('/');
            }
          }
        );
      } else {
        toast.error('Error al procesar el pago: ' + data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al procesar el pago');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer position="top-center" />
      {showSuccessAnimation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="w-64 h-64">
            <Lottie animationData={successAnimation} loop={false} />
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resumen del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="font-bold mt-4">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Información de Pago</CardTitle>
            <CardDescription>Ingrese los detalles de su tarjeta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                  <Input
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentInfo.cardNumber}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="expirationDate">Fecha de Expiración</Label>
                  <Input
                    id="expirationDate"
                    name="expirationDate"
                    value={paymentInfo.expirationDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    name="cvv"
                    value={paymentInfo.cvv}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full mt-4">Pagar ${totalAmount.toFixed(2)}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
