import React, { useState, useEffect } from 'react';
import './Trump.css';

export default function Trump() {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  const quotes = [
    "$WLFI 47U is going to be YUGE!",
    "We're gonna build a great crypto wall!",
    "Nobody knows $WLFI better than me!",
    "$WLFI to the moon - believe me!",
    "Fake news won't stop $WLFI!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="trump-container">
      <h2>"Make Crypto Great Again!"</h2>
      <div className="trump-hand-animation">
        <div className="hand">✋</div>
      </div>
      <div className="trump-quote">
        {quotes[currentQuote]}
      </div>
    </div>
  );
}
