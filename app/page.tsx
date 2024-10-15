'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Lottie from 'lottie-react';
import burgerAnimation from '@/public/burger-animation.json';
import { Utensils, ShoppingCart } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="w-64 h-64 mb-8">
        <Lottie animationData={burgerAnimation} loop={true} />
      </div>
      <h1 className="text-4xl font-bold mb-6 text-center">Bienvenido a Hamburguesa App</h1>
      <p className="text-xl mb-8 text-center">Las mejores hamburguesas a un clic de distancia</p>
      <div className="space-y-4 w-full max-w-xs">
        <Button asChild className="w-full">
          <Link href="/menu">
            <Utensils className="mr-2 h-4 w-4" /> Ver Menú
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ShoppingCart className="mr-2 h-4 w-4" /> Iniciar Sesión
          </Link>
        </Button>
      </div>
    </div>
  );
}