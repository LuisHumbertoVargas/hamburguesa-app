"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAppContext } from '@/lib/context/AppContext';
import { ShoppingCart, Plus, Minus, Utensils } from 'lucide-react';
import axios from 'axios';
import Image from 'next/image';
import { ShoppingCartComponent } from '@/components/ShoppingCart';

type MenuItem = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  calories: number;
  ingredients: string[];
};

type MenuSection = {
  title: string;
  items: MenuItem[];
};

export default function MenuPage() {
  const [menuSections, setMenuSections] = useState<MenuSection[]>([]);
  const { cart, addToCart, removeFromCart } = useAppContext();

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const sections = [
          { title: 'Hamburguesas', query: 'burger and fries' },
          { title: 'Complementos', query: 'fries and ketchup' },
          { title: 'Bebidas', query: 'sprite, coke, water' }
        ];

        const fetchedSections = await Promise.all(sections.map(async (section) => {
          const response = await axios.get('https://api.spoonacular.com/food/menuItems/search', {
            params: {
              query: section.query,
              number: 6,
              apiKey: 'a0bbbb7c582b4c4fbd48dac4732993aa'
            }
          });

          const items = response.data.menuItems.map((item: any) => ({
            id: item.id,
            name: item.title,
            price: (item.price || Math.random() * 10 + 5).toFixed(2),
            description: item.description || `Delicioso ${section.title.slice(0, -1).toLowerCase()}`,
            image: item.image,
            calories: item.calories,
            ingredients: item.ingredients || []
          }));

          return { title: section.title, items };
        }));

        setMenuSections(fetchedSections);
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    fetchMenuItems();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-center text-center mb-6">
        <Utensils className="mr-2 h-6 w-6" />
        <h1 className="text-4xl font-bold">Nuestro Menú</h1>
      </div>
      <ShoppingCartComponent />
      {menuSections.map((section, index) => (
        <div key={index} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.items.map((item) => (
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
                  <Button onClick={() => addToCart({ ...item, quantity: 1 })} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black">
                    <ShoppingCart className="mr-2 h-4 w-4" /> Agregar al carrito
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
