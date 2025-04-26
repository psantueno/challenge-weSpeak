'use server'

import { PrismaClient } from '@prisma/client'


const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Trae el valor actual del contador desde la base de datos.
export async function getCounterValue() {
  try {
    const counter = await prisma.counter.findUnique({ 
      where: { id: 'GLOBAL' }
    });
    return counter?.value ?? 0;
  } catch (error) {
    console.error('Error in getCounterValue:', error);
    return 0;
  }
}

// Incrementa en +1 el valor del contador en la base de datos y actualiza la fecha de la última modificación.
export async function incrementCounter() {
  try {
    const updated = await prisma.counter.update({
      where: { id: 'GLOBAL' },
      data: { 
        value: { increment: 1 },
        last_updated: new Date()
      }
    });
    return updated.value;
  } catch (error) {
    console.error('Error in incrementCounter:', error);
    throw new Error('Failed to increment counter');
  }
}

// Decrementa en -1 el valor del contador en la base de datos y actualiza la fecha de la última modificación.
export async function decrementCounter() {
  try {
    const updated = await prisma.counter.update({
      where: { id: 'GLOBAL' },
      data: { 
        value: { decrement: 1 },
        last_updated: new Date()
      }
    });
    return updated.value;
  } catch (error) {
    console.error('Error in decrementCounter:', error);
    throw new Error('Failed to decrement counter');
  }
}
