import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  BellRing, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Calendar 
} from 'lucide-react';
import { getNotificationPermission } from '../utils/notifications';

export default function NotificationModal({
  isOpen,
  onClose,
  notificationSettings,
  onUpdateSettings,
  onTriggerTest,
  dueInstallments = [],
  onToggleItem
}) {
  if (!isOpen) return null;

  const [permission, setPermission] = useState(getNotificationPermission);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState('');

  const handleEnableNotifications = async () => {
    setTesting(true);
    setTestResult('');
    const success = await onTriggerTest();
    setPermission(getNotificationPermission());
    setTesting(false);
    if (success) {
      setTestResult('Test notification sent successfully! 🎉');
    } else {
      setTestResult('Permission denied or not granted.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#0F1522] border border-slate-700/80 rounded-3xl p-6 shadow-2xl relative">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white leading-tight">
                Savings Reminders
              </h3>
              <p className="text-[11px] text-slate-400">Never miss a scheduled deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800/80 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Permission Status Box */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Push Notifications</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                permission === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                {permission === 'granted' ? 'Enabled' : permission === 'denied' ? 'Blocked' : 'Action Needed'}
              </span>
            </div>

            <p className="text-xs text-slate-400">
              {permission === 'granted'
                ? 'Notifications are active on this device. You will receive gentle reminders for upcoming deposits.'
                : 'Enable device alerts so you get notified when it is time to make your scheduled contribution.'}
            </p>

            <button
              onClick={handleEnableNotifications}
              disabled={testing}
              className="mt-3 w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{testing ? 'Sending...' : 'Test / Enable Notification Now'}</span>
            </button>

            {testResult && (
              <p className="text-[11px] text-emerald-400 font-medium mt-2 text-center">
                {testResult}
              </p>
            )}
          </div>

          {/* Reminder Schedule Settings */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Preferred Reminder Time
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                    <Clock className="w-4 h-4" />
                  </span>
                  <input
                    type="time"
                    value={notificationSettings.reminderTime || '20:00'}
                    onChange={(e) => onUpdateSettings({ reminderTime: e.target.value })}
                    className="w-full bg-[#182130] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <select
                  value={notificationSettings.frequency || 'daily'}
                  onChange={(e) => onUpdateSettings({ frequency: e.target.value })}
                  className="bg-[#182130] border border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="daily">Every Day</option>
                  <option value="weekly">Weekly (Monday)</option>
                  <option value="due_only">On Due Dates</option>
                </select>
              </div>
            </div>
          </div>

          {/* Due Today List if any */}
          {dueInstallments.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                Due Today ({dueInstallments.length})
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {dueInstallments.slice(0, 3).map((item) => (
                  <div key={`${item.goalId}-${item.itemId}`} className="flex items-center justify-between text-xs p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    <div>
                      <span className="font-bold text-white block">{item.goalTitle}</span>
                      <span className="text-[10px] text-slate-400">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-emerald-400">{item.currency}{item.amount}</span>
                      <button
                        onClick={() => onToggleItem(item.itemId)}
                        className="px-2 py-1 rounded-lg bg-emerald-500 text-black text-[10px] font-bold hover:bg-emerald-400"
                      >
                        Deposit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
