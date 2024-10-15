"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppContext } from '@/lib/context/AppContext';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  calories: number;
  ingredients: string[];
};

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const { cart, addToCart, removeFromCart } = useAppContext();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await axios.get('https://api.spoonacular.com/food/menuItems/search', {
          params: {
            query: 'burger',
            number: 10,
            apiKey: 'a0bbbb7c582b4c4fbd48dac4732993aa' // Reemplaza con tu clave de API real
          }
        });
        const items = response.data.menuItems.map((item: any) => ({
          id: item.id,
          name: item.title,
          price: (item.price || Math.random() * 10 + 5).toFixed(2),
          description: item.description || 'Deliciosa hamburguesa',
          image: item.image,
          calories: item.calories,
          ingredients: item.ingredients || []
        }));
        setMenuItems(items);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nuestro Menú</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <Image src={item.image} alt={item.name} width={500} height={200} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>${item.price}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-2">{item.description}</p>
              <p className="text-sm text-muted-foreground">Calorías: {item.calories}</p>
              <p className="text-sm text-muted-foreground">Ingredientes: {item.ingredients.join(', ')}</p>
            </CardContent>
            <CardFooter>
              <Button onClick={() => addToCart({ ...item, quantity: 1 })} className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al carrito
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Carrito ({cart.length})</h2>
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center mb-2 p-2 bg-secondary rounded-lg">
            <span>{item.name}</span>
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="mx-2">{item.quantity}</span>
              <Button variant="outline" size="icon" onClick={() => addToCart(item)}>
                <Plus className="h-4 w-4" />
              </Button>
              <span className="ml-4">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          </div>
        ))}
        <Button className="mt-4" disabled={cart.length === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" /> Proceder al pago
        </Button>
      </div>
    </div>
  );
}
