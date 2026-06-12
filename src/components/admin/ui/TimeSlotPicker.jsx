import React, { useState } from 'react';
import { Clock, X, Plus } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const HOURS = Array.from({ length: 12 }, (_, i) => i + 1);  // 1-12
const PERIODS = ['AM', 'PM'];

const formatSlot = (day, fromH, fromP, toH, toP) =>
  `${day} ${fromH}-${toH} ${fromP === toP ? fromP : `${fromP}-${toP}`}`;

const TimeSlotPicker = ({ value = [], onChange }) => {
  const [day, setDay]       = useState('Mon');
  const [fromH, setFromH]   = useState(10);
  const [fromP, setFromP]   = useState('AM');
  const [toH, setToH]       = useState(11);
  const [toP, setToP]       = useState('AM');
  const [open, setOpen]     = useState(false);

  const add = () => {
    const slot = formatSlot(day, fromH, fromP, toH, toP);
    if (value.includes(slot)) return;
    onChange([...value, slot]);
    setOpen(false);
  };

  const remove = (slot) => onChange(value.filter(v => v !== slot));

  return (
    <div className="space-y-2">
      {/* Selected slots */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map(slot => (
            <span key={slot} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-blue-500/30">
              <Clock size={11} />
              {slot}
              <button type="button" onClick={() => remove(slot)} className="hover:text-white transition-colors ml-0.5">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add slot trigger */}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-sm text-gray-400 hover:text-white hover:border-amber-500 transition-colors w-full"
        >
          <Plus size={14} />
          Add time slot
        </button>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-2">
            <Clock size={13} /> Set Time Slot
          </p>

          {/* Day selector */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Day</p>
            <div className="flex flex-wrap gap-1.5">
              {DAYS.map(d => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    day === d
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Clock pickers */}
          <div className="grid grid-cols-2 gap-4">
            {/* From */}
            <div>
              <p className="text-xs text-gray-500 mb-2">From</p>
              <div className="flex gap-2 items-center">
                {/* Hour dial */}
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {HOURS.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setFromH(h)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        fromH === h
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                {/* AM/PM */}
                <div className="flex flex-col gap-1">
                  {PERIODS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFromP(p)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        fromP === p
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* To */}
            <div>
              <p className="text-xs text-gray-500 mb-2">To</p>
              <div className="flex gap-2 items-center">
                <div className="flex-1 grid grid-cols-4 gap-1">
                  {HOURS.map(h => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setToH(h)}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        toH === h
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-1">
                  {PERIODS.map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setToP(p)}
                      className={`px-2 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        toP === p
                          ? 'bg-amber-500 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview & actions */}
          <div className="flex items-center justify-between pt-1 border-t border-gray-700">
            <span className="text-sm text-amber-300 font-medium flex items-center gap-1.5">
              <Clock size={13} />
              {formatSlot(day, fromH, fromP, toH, toP)}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={add}
                className="px-3 py-1.5 text-xs text-white bg-amber-500 hover:bg-amber-600 rounded-lg font-medium transition-colors"
              >
                Add Slot
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
