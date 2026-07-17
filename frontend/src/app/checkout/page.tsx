'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/Header';
import {
  CalendarDaysIcon,
  UserGroupIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckSolid } from '@heroicons/react/24/solid';

const STEPS = [
  { id: 1, label: 'Dates', icon: <CalendarDaysIcon className="w-4 h-4" /> },
  { id: 2, label: 'Guests', icon: <UserGroupIcon className="w-4 h-4" /> },
  { id: 3, label: 'Payment', icon: <CreditCardIcon className="w-4 h-4" /> },
  { id: 4, label: 'Confirm', icon: <CheckCircleIcon className="w-4 h-4" /> },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}


const FULL_MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function MiniCalendar({ label, value, onChange, minDate }: { label: string; value: string; onChange: (v: string) => void; minDate?: string }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const selected = value ? new Date(value) : null;
  const min = minDate ? new Date(minDate) : today;

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    if (d < min) return;
    onChange(`${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
  };

  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.08)' }}>
      <div className="text-xs font-semibold mb-3" style={{ color: '#9898A0' }}>{label}</div>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#9898A0' }}>‹</button>
        <span className="text-sm font-bold" style={{ color: '#EEEEF0' }}>{FULL_MONTH_NAMES[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" style={{ color: '#9898A0' }}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs py-1" style={{ color: '#9898A0' }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(viewYear, viewMonth, day);
          const isSelected = selected && date.toDateString() === selected.toDateString();
          const isPast = date < min;
          return (
            <button
              key={day}
              onClick={() => selectDay(day)}
              disabled={isPast}
              className="aspect-square flex items-center justify-center text-xs rounded-lg transition-all duration-150 font-medium"
              style={{
                background: isSelected ? 'rgba(139,92,246,0.8)' : 'transparent',
                color: isPast ? '#3A3A45' : isSelected ? '#fff' : '#EEEEF0',
                cursor: isPast ? 'not-allowed' : 'pointer',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
      {value && (
        <div className="mt-3 text-center text-xs font-semibold px-3 py-1.5 rounded-lg" style={{ background: 'rgba(139,92,246,0.15)', color: '#A78BFA' }}>
          {new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </div>
      )}
    </div>
  );
}

function CheckoutContent() {
  const searchParams = useSearchParams();

  const propertyId = searchParams.get('propertyId') || '1';
  const propertyTitle = searchParams.get('title') || 'Modern Studio near Cyber Hub';
  const propertyCity = searchParams.get('city') || 'Gurugram';
  const propertyPrice = parseInt(searchParams.get('price') || '22000', 10);
  const propertyImage = searchParams.get('image') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400&q=80';

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'netbanking'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [processing, setProcessing] = useState(false);
  const [bookingId] = useState(`BK${Date.now().toString().slice(-6)}`);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 30;

  const baseAmount = propertyPrice;
  const serviceFee = Math.round(baseAmount * 0.05);
  const gstAmount = Math.round((baseAmount + serviceFee) * 0.18);
  const totalAmount = baseAmount + serviceFee + gstAmount;

  const canProceedStep1 = checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
  const canProceedStep3 = paymentMethod === 'card' ? cardNumber.replace(/\s/g,'').length >= 16 && cardName && cardExpiry && cardCvv.length >= 3
    : paymentMethod === 'upi' ? upiId.includes('@') : true;

  const handleConfirm = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setStep(4);
    }, 1800);
  };

  const formatCard = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (v: string) => {
    const digits = v.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  return (
    <div className="min-h-screen" style={{ background: '#09090B' }}>
      <Header onFindMatch={() => {}} />

      <div className="max-w-4xl mx-auto px-4 md:px-8 pt-24 pb-16">
        <Link href={`/property/${propertyId}`} className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-80 transition-opacity" style={{ color: '#9898A0' }}>
          <ArrowLeftIcon className="w-4 h-4" /> Back to Property
        </Link>

        {step < 4 && (
          <>
            <h1 className="text-2xl font-bold font-display mb-6" style={{ color: '#EEEEF0' }}>Complete Your Booking</h1>

            {/* Step Indicator */}
            <div className="flex items-center gap-0 mb-8">
              {STEPS.map((s, i) => (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: step > s.id ? 'rgba(139,92,246,0.8)' : step === s.id ? 'rgba(139,92,246,0.25)' : 'rgba(238,238,240,0.06)',
                        border: step >= s.id ? '2px solid rgba(139,92,246,0.6)' : '2px solid rgba(238,238,240,0.1)',
                        color: step >= s.id ? '#A78BFA' : '#9898A0',
                      }}
                    >
                      {step > s.id ? <CheckSolid className="w-4 h-4 text-white" /> : s.icon}
                    </div>
                    <span className="text-xs mt-1.5 font-medium" style={{ color: step >= s.id ? '#A78BFA' : '#9898A0' }}>{s.label}</span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mx-2 mb-5 transition-all duration-300" style={{ background: step > s.id ? 'rgba(139,92,246,0.5)' : 'rgba(238,238,240,0.08)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Dates */}
            {step === 1 && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <CalendarDaysIcon className="w-5 h-5" style={{ color: '#A78BFA' }} />
                  <h2 className="text-base font-bold" style={{ color: '#EEEEF0' }}>Select Your Dates</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MiniCalendar label="CHECK-IN DATE" value={checkIn} onChange={setCheckIn} />
                  <MiniCalendar label="CHECK-OUT DATE" value={checkOut} onChange={setCheckOut} minDate={checkIn || undefined} />
                </div>
                {checkIn && checkOut && new Date(checkOut) > new Date(checkIn) && (
                  <div className="mt-4 flex items-center gap-2 text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.25)', color: '#A78BFA' }}>
                    <SparklesIcon className="w-4 h-4" />
                    <span className="font-medium">{nights} night{nights > 1 ? 's' : ''} selected</span>
                    <span style={{ color: '#9898A0' }}>·</span>
                    <span style={{ color: '#9898A0' }}>
                      {new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} → {new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => setStep(2)}
                  disabled={!canProceedStep1}
                  className="mt-5 w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                  style={{ background: canProceedStep1 ? 'rgba(139,92,246,0.8)' : 'rgba(238,238,240,0.06)', color: canProceedStep1 ? '#fff' : '#9898A0', cursor: canProceedStep1 ? 'pointer' : 'not-allowed' }}
                >
                  Continue to Guests <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: Guests */}
            {step === 2 && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <UserGroupIcon className="w-5 h-5" style={{ color: '#A78BFA' }} />
                  <h2 className="text-base font-bold" style={{ color: '#EEEEF0' }}>Number of Guests</h2>
                </div>
                <div className="flex items-center justify-center gap-8 py-10">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-105"
                    style={{ background: guests > 1 ? 'rgba(139,92,246,0.2)' : 'rgba(238,238,240,0.06)', border: guests > 1 ? '2px solid rgba(139,92,246,0.4)' : '2px solid rgba(238,238,240,0.1)', color: guests > 1 ? '#A78BFA' : '#3A3A45' }}
                  >
                    −
                  </button>
                  <div className="text-center">
                    <div className="text-6xl font-bold font-display" style={{ color: '#EEEEF0' }}>{guests}</div>
                    <div className="text-sm mt-2" style={{ color: '#9898A0' }}>guest{guests > 1 ? 's' : ''}</div>
                  </div>
                  <button
                    onClick={() => setGuests(g => Math.min(10, g + 1))}
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold transition-all duration-200 hover:scale-105"
                    style={{ background: 'rgba(139,92,246,0.2)', border: '2px solid rgba(139,92,246,0.4)', color: '#A78BFA' }}
                  >
                    +
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <button key={n} onClick={() => setGuests(n)}
                      className="py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={{ background: guests === n ? 'rgba(139,92,246,0.2)' : 'rgba(238,238,240,0.04)', border: guests === n ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(238,238,240,0.06)', color: guests === n ? '#A78BFA' : '#9898A0' }}>
                      {n} guest{n > 1 ? 's' : ''}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>
                    Back
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2" style={{ background: 'rgba(139,92,246,0.8)', color: '#fff' }}>
                    Continue to Payment <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="rounded-2xl p-6" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
                <div className="flex items-center gap-2 mb-5">
                  <CreditCardIcon className="w-5 h-5" style={{ color: '#A78BFA' }} />
                  <h2 className="text-base font-bold" style={{ color: '#EEEEF0' }}>Payment Method</h2>
                </div>

                {/* Method Selector */}
                <div className="flex gap-2 mb-5">
                  {[
                    { id: 'card' as const, label: '💳 Card' },
                    { id: 'upi' as const, label: '📱 UPI' },
                    { id: 'netbanking' as const, label: '🏦 Net Banking' },
                  ].map(m => (
                    <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                      style={{ background: paymentMethod === m.id ? 'rgba(139,92,246,0.2)' : 'rgba(238,238,240,0.04)', border: paymentMethod === m.id ? '1px solid rgba(139,92,246,0.4)' : '1px solid rgba(238,238,240,0.06)', color: paymentMethod === m.id ? '#A78BFA' : '#9898A0' }}>
                      {m.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>Card Number</label>
                      <input value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
                        placeholder="1234 5678 9012 3456" maxLength={19}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>Cardholder Name</label>
                      <input value={cardName} onChange={e => setCardName(e.target.value)}
                        placeholder="Name as on card"
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                        style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>Expiry Date</label>
                        <input value={cardExpiry} onChange={e => setCardExpiry(formatExpiry(e.target.value))}
                          placeholder="MM/YY" maxLength={5}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }} />
                      </div>
                      <div>
                        <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>CVV</label>
                        <input value={cardCvv} onChange={e => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="•••" type="password" maxLength={4}
                          className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                          style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'upi' && (
                  <div>
                    <label className="text-xs font-medium block mb-1.5" style={{ color: '#9898A0' }}>UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)}
                      placeholder="yourname@upi"
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                      style={{ background: 'rgba(238,238,240,0.06)', border: '1px solid rgba(238,238,240,0.12)', color: '#EEEEF0' }} />
                    <p className="text-xs mt-2" style={{ color: '#9898A0' }}>Enter your UPI ID (e.g. name@okaxis, name@paytm)</p>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'ICICI Bank', 'SBI', 'Axis Bank', 'Kotak Bank', 'Yes Bank'].map(bank => (
                      <button key={bank} className="py-3 px-4 rounded-xl text-sm font-medium text-left transition-all hover:bg-white/5"
                        style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.06)', color: '#EEEEF0' }}>
                        {bank}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: '#9898A0' }}>
                  <LockClosedIcon className="w-3.5 h-3.5" />
                  Secured by 256-bit SSL encryption
                </div>

                <div className="flex gap-3 mt-5">
                  <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>
                    Back
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!canProceedStep3 || processing}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                    style={{ background: canProceedStep3 ? 'rgba(139,92,246,0.8)' : 'rgba(238,238,240,0.06)', color: canProceedStep3 ? '#fff' : '#9898A0', cursor: canProceedStep3 ? 'pointer' : 'not-allowed' }}
                  >
                    {processing ? (
                      <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Processing...</>
                    ) : (
                      <>Confirm & Pay ₹{totalAmount.toLocaleString('en-IN')}</>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div className="rounded-2xl p-8 text-center" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.25)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(34,197,94,0.15)' }}>
                  <CheckSolid className="w-8 h-8" style={{ color: '#86EFAC' }} />
                </div>
                <h2 className="text-2xl font-bold font-display mb-2" style={{ color: '#EEEEF0' }}>Booking Confirmed!</h2>
                <p className="text-sm mb-1" style={{ color: '#9898A0' }}>Your booking request has been sent to the host.</p>
                <p className="text-xs mb-6" style={{ color: '#9898A0' }}>Booking ID: <span className="font-mono font-bold" style={{ color: '#A78BFA' }}>{bookingId}</span></p>

                <div className="rounded-xl p-4 mb-6 text-left" style={{ background: 'rgba(238,238,240,0.04)', border: '1px solid rgba(238,238,240,0.07)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={propertyImage} alt={propertyTitle} className="w-14 h-14 rounded-xl object-cover" />
                    <div>
                      <div className="text-sm font-bold" style={{ color: '#EEEEF0' }}>{propertyTitle}</div>
                      <div className="text-xs" style={{ color: '#9898A0' }}>{propertyCity}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Check-in', value: checkIn ? new Date(checkIn).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD' },
                      { label: 'Check-out', value: checkOut ? new Date(checkOut).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'TBD' },
                      { label: 'Guests', value: `${guests}` },
                    ].map(item => (
                      <div key={item.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(238,238,240,0.04)' }}>
                        <div className="text-sm font-bold" style={{ color: '#EEEEF0' }}>{item.value}</div>
                        <div className="text-xs" style={{ color: '#9898A0' }}>{item.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Link href="/dashboard" className="flex-1 py-3 rounded-xl text-sm font-semibold text-center" style={{ background: 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.35)', color: '#A78BFA' }}>
                    View Dashboard
                  </Link>
                  <Link href="/listings" className="flex-1 py-3 rounded-xl text-sm font-semibold text-center" style={{ background: 'rgba(238,238,240,0.06)', color: '#9898A0' }}>
                    Browse More
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Price Breakdown */}
          {step < 4 && (
            <div className="space-y-4">
              <div className="rounded-2xl p-5 sticky top-24" style={{ background: 'rgba(238,238,240,0.03)', border: '1px solid rgba(238,238,240,0.07)' }}>
                <img src={propertyImage} alt={propertyTitle} className="w-full h-32 object-cover rounded-xl mb-4" />
                <h3 className="text-sm font-bold mb-0.5" style={{ color: '#EEEEF0' }}>{propertyTitle}</h3>
                <p className="text-xs mb-4" style={{ color: '#9898A0' }}>{propertyCity}</p>

                <div className="space-y-2.5 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#9898A0' }}>₹{propertyPrice.toLocaleString('en-IN')} × {nights} night{nights > 1 ? 's' : ''}</span>
                    <span style={{ color: '#EEEEF0' }}>₹{(propertyPrice * nights).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#9898A0' }}>Service fee (5%)</span>
                    <span style={{ color: '#EEEEF0' }}>₹{(serviceFee * nights).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: '#9898A0' }}>GST (18%)</span>
                    <span style={{ color: '#EEEEF0' }}>₹{(gstAmount * nights).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="h-px my-1" style={{ background: 'rgba(238,238,240,0.08)' }} />
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold" style={{ color: '#EEEEF0' }}>Total</span>
                    <span className="text-base font-bold" style={{ color: '#A78BFA' }}>₹{(totalAmount * nights).toLocaleString('en-IN')}</span>
                  </div>
                  {nights > 1 && (
                    <div className="text-xs text-right" style={{ color: '#9898A0' }}>₹{totalAmount.toLocaleString('en-IN')}/month</div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs p-3 rounded-xl" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#86EFAC' }}>
                  <ShieldCheckIcon className="w-4 h-4 shrink-0" />
                  Free cancellation within 48 hours
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#09090B' }}>
        <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
