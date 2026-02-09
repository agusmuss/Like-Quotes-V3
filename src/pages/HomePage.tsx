import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import QuoteCard from "../components/QuoteCard";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Quote } from "../quotes";

type QuoteRecord = Quote & {
  createdBy?: string;
  validated?: boolean;
};

export default function HomePage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    const quotesQuery = query(
      collection(db, "quotes"),
      where("validated", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      quotesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Partial<QuoteRecord>;
          return {
            id: docSnap.id,
            quote: data.quote ?? "",
            author: data.author ?? "Unknown",
            likeCount: data.likeCount ?? 0,
            createdBy: data.createdBy,
            validated: Boolean(data.validated),
          };
        });
        setQuotes(data);
        setLoading(false);
        setLoadError("");
      },
      (error) => {
        setLoadError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (currentQuoteIndex >= quotes.length && quotes.length > 0) {
      setCurrentQuoteIndex(0);
    }
  }, [quotes, currentQuoteIndex]);

  const handleNextQuote = () => {
    if (!quotes.length) {
      return;
    }
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
  };

  const handleLike = async () => {
    const currentQuote = quotes[currentQuoteIndex];
    if (!currentQuote) {
      return;
    }
    await updateDoc(doc(db, "quotes", currentQuote.id), {
      likeCount: increment(1),
    });
  };

  const handleUpdateQuote = async (quoteText: string, authorText: string) => {
    const currentQuote = quotes[currentQuoteIndex];
    if (!currentQuote) {
      return;
    }
    if (!user || currentQuote.createdBy !== user.uid) {
      throw new Error("You can only edit your own quotes.");
    }
    await updateDoc(doc(db, "quotes", currentQuote.id), {
      quote: quoteText,
      author: authorText,
      updatedAt: serverTimestamp(),
    });
  };

  const handleDeleteQuote = async () => {
    const currentQuote = quotes[currentQuoteIndex];
    if (!currentQuote) {
      return;
    }
    if (!user || currentQuote.createdBy !== user.uid) {
      throw new Error("You can only delete your own quotes.");
    }
    await deleteDoc(doc(db, "quotes", currentQuote.id));
  };

  const currentQuote = quotes[currentQuoteIndex];
  const canManageQuote =
    Boolean(user) && Boolean(currentQuote?.createdBy) &&
    currentQuote?.createdBy === user?.uid;

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100 sm:text-4xl">
          Find your next spark
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Browse validated quotes from the community.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading quotes...
        </p>
      ) : loadError ? (
        <p className="text-sm text-red-600" role="alert">
          {loadError}
        </p>
      ) : currentQuote ? (
        <QuoteCard
          quote={currentQuote.quote}
          author={currentQuote.author}
          likeCount={currentQuote.likeCount}
          onLike={handleLike}
          onNext={handleNextQuote}
          canManage={canManageQuote}
          onUpdate={handleUpdateQuote}
          onDelete={handleDeleteQuote}
        />
      ) : (
        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No validated quotes yet. Check back soon!
          </p>
          {user ? (
            <Link
              to="/quotes/new"
              className="mt-4 inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
            >
              Submit the first quote
            </Link>
          ) : null}
        </div>
      )}
    </section>
  );
}
