import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import sqlite3 from "sqlite3";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}