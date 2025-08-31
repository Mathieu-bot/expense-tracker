
import { DollarSign, TrendingUp, Target } from "lucide-react";

export const authLabelCls = 'peer-focus:!text-primary peer-placeholder-shown:!text-primary';

export const modalLabelCls = 'peer-focus:!text-accent peer-placeholder-shown:!text-white'

export const authInputCls = '!border-b-1 !border-gray-400 focus:!border-primary';

export const modalInputCls = '!border-b-1 !border-gray-400 focus:!border-accent !text-white'

export const submitCls = `bg-primary text-white hover:bg-primary/90 focus:ring-2 focus:ring-accent focus:bg-primary/90`

export const authGoogleCls = `!border !border-primary-light !bg-white hover:!bg-accent/10 focus:!border-accent focus:bg-accent/10`

export const textFieldModalCls = { 
  label: `${modalLabelCls}`, 
  input: `${modalInputCls}`, 
  helperText:"!text-light",
  error: "hidden"
};

export const modalCls = {
  panel: "!bg-primary/80 !backdrop-blur-sm", 
  title: "!text-light", 
  overlay:"!bg-black/10",
  body: "text-light" 
}

export const landingContent = {
  hero: {
    title: "Take control of your",
    titleHighlight: "finances",
    subtitle: "Track expenses, manage income, and achieve your financial goals with PennyPal's intuitive interface."
  },
  testimonial: {
    quote: "PennyPal transformed how I manage my finances. I finally have clarity on where my money goes and can make informed decisions about my spending.",
    author: "Sarah Johnson"
  }
};

export const features = [
  {
    id: 'expense-tracking',
    icon: DollarSign,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/20',
    title: 'Smart Expense Tracking',
    titleColor: 'text-gray-800',
    description: 'Categorize and analyze your spending patterns',
    descriptionColor: 'text-primary'
  },
  {
    id: 'income-management', 
    icon: TrendingUp,
    iconColor: 'text-accent',
    bgColor: 'bg-primary/20',
    title: 'Income Management',
    titleColor: 'text-gray-800',
    description: 'Monitor multiple income sources effortlessly',
    descriptionColor: 'text-primary'
  },
  {
    id: 'financial-goals',
    icon: Target,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/20', 
    title: 'Financial Goals',
    titleColor: 'text-primary-dark',
    description: 'Set and achieve your savings targets',
    descriptionColor: 'text-primary'
  }
];
