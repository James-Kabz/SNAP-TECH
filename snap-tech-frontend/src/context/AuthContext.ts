// context/AuthContext.ts
import { createContext } from 'react';
import { AuthContextType } from '@/lib/types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);