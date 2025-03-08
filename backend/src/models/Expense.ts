import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  amount: number;
  category: string;
  date: Date;
  description?: string;
  type: 'expense' | 'saving' | 'income';
  savingCategory?: string;
  operation?: 'add' | 'deduct';  // For savings operations
}

const ExpenseSchema: Schema = new Schema({
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  description: { type: String },
  type: { type: String, enum: ['expense', 'saving', 'income'], required: true },
  savingCategory: { type: String, enum: ['SIB', 'KSFE'] },
  operation: { type: String, enum: ['add', 'deduct'] }, // For savings operations
}, {
  timestamps: true
});

export default mongoose.model<IExpense>('Expense', ExpenseSchema); 