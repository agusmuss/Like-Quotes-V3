import { useState } from "react";
import "./App.css";
import QuoteCard from "./components/QuoteCard";
import { quotes as initialQuotes } from "./quotes";

function App() {
  const [quotes, setQuotes] = useState(initialQuotes);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const handleNextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleLike = () => {
    setQuotes((prevQuotes) =>
      prevQuotes.map((quote, index) =>
        index === currentQuoteIndex
          ? { ...quote, likeCount: quote.likeCount + 1 }
          : quote
      )
    );
  };

  const currentQuote = quotes[currentQuoteIndex];

  return (
    <div className="app">
      <QuoteCard
        quote={currentQuote.quote}
        author={currentQuote.author}
        likeCount={currentQuote.likeCount}
        onLike={handleLike}
        onNext={handleNextQuote}
      />
    </div>
  );
}

export default App;
