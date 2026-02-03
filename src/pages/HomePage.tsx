import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import QuoteCard from "../components/QuoteCard";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Quote } from "../quotes";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

type QuoteRecord = Quote & {
  createdBy?: string;
};

export default function HomePage() {
  const { user } = useAuth();
  const [quotes, setQuotes] = useState<QuoteRecord[]>([]);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [newQuote, setNewQuote] = useState("");
  const [newAuthor, setNewAuthor] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const quotesQuery = query(
      collection(db, "quotes"),
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

  const handleAddQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAddError("");
    setAddSuccess("");

    if (!user) {
      setAddError("Please sign in to add a quote.");
      return;
    }

    const trimmedQuote = newQuote.trim();
    const trimmedAuthor = newAuthor.trim();

    if (!trimmedQuote || !trimmedAuthor) {
      setAddError("Please fill in both the quote and author.");
      return;
    }

    setIsAdding(true);
    try {
      await addDoc(collection(db, "quotes"), {
        quote: trimmedQuote,
        author: trimmedAuthor,
        likeCount: 0,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
      });
      setNewQuote("");
      setNewAuthor("");
      setAddSuccess("Quote added successfully.");
    } catch (error) {
      setAddError(getErrorMessage(error));
    } finally {
      setIsAdding(false);
    }
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
          Browse quotes, save the ones you love, and keep the momentum going.
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
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No quotes yet. Be the first to add one!
        </p>
      )}

      <form
        className="w-full rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
        onSubmit={handleAddQuote}
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Quote
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              rows={3}
              value={newQuote}
              onChange={(event) => setNewQuote(event.target.value)}
            />
          </label>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Author
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              value={newAuthor}
              onChange={(event) => setNewAuthor(event.target.value)}
            />
          </label>
        </div>
        {addError ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {addError}
          </p>
        ) : null}
        {addSuccess ? (
          <p className="mt-3 text-sm text-emerald-600" role="status">
            {addSuccess}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isAdding}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {isAdding ? "Adding..." : "Add quote"}
        </button>
      </form>
    </section>
  );
}

