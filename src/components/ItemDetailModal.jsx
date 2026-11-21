import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Circle, Calendar, FileText, DollarSign, Save } from 'lucide-react';

export default function ItemDetailModal({
  isOpen,
  item,
  currency = '₹',
  onClose,
  onUpdateItem,
  onToggleItem
}) {
  if (!isOpen || !item) return null;

  const [amount, setAmount] = useState(item.amount || '');
  const [note, setNote] = useState(item.note || '');
  const [dueDate, setDueDate] = useState(item.dueDate || '');

  useEffect(() => {
    setAmount(item.amount || '');
    setNote(item.note || '');
    setDueDate(item.dueDate || '');
  }, [item]);

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateItem(item.id, {
      amount: Number(amount) || item.amount,
      note,
      dueDate,
    });
    onClose();
  };

  const handleStatusToggle = () => {
    onToggleItem(item.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0F1522] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
              Installment Details
            </span>
            <h3 className="text-xl font-extrabold text-white">
              {item.label}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Toggle Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              item.saved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-400'
            }`}>
              {item.saved ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs text-slate-400 block font-medium">Status</span>
              <span className={`text-sm font-bold ${item.saved ? 'text-emerald-400' : 'text-slate-300'}`}>
                {item.saved ? 'Deposit Completed' : 'Pending Contribution'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStatusToggle}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              item.saved
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-emerald-500 text-black hover:bg-emerald-400 font-extrabold'
            }`}
          >
            {item.saved ? 'Mark Pending' : 'Mark as Saved'}
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Amount input */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Contribution Amount ({currency})
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                {currency}
              </span>
              <input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-9 pr-3.5 py-2.5 text-sm font-bold font-mono text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Scheduled / Due Date */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Scheduled Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Personal Note */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              Deposit Note / Memo (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Saved by cooking at home, Freelance bonus"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-[#182130] border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-all shadow-md active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              Save Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
