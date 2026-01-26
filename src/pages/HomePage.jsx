import { useState } from "react";
import QuoteCard from "../components/QuoteCard";
import { quotes as initialQuotes } from "../quotes";

export default function HomePage() {
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
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
          Daily Inspiration
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Find your next spark
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Browse quotes, save the ones you love, and keep the momentum going.
        </p>
      </div>
      {currentQuote ? (
        <QuoteCard
          quote={currentQuote.quote}
          author={currentQuote.author}
          likeCount={currentQuote.likeCount}
          onLike={handleLike}
          onNext={handleNextQuote}
        />
      ) : null}
    </section>
  );
}
