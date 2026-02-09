import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Quote } from "../quotes";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

type AdminQuote = Quote & {
  createdBy?: string;
  validated?: boolean;
};

export default function AdminPage() {
  const { user, userProfile } = useAuth();
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isAdmin = Boolean(userProfile?.isAdmin);

  useEffect(() => {
    if (!isAdmin) {
      setQuotes([]);
      setLoading(false);
      return;
    }

    const quotesQuery = query(
      collection(db, "quotes"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      quotesQuery,
      (snapshot) => {
        const data = snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as Partial<AdminQuote>;
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
        setError("");
      },
      (snapshotError) => {
        setError(snapshotError.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  const handleValidate = async (quoteId: string) => {
    if (!user) {
      return;
    }

    try {
      await updateDoc(doc(db, "quotes", quoteId), {
        validated: true,
        validatedAt: serverTimestamp(),
        validatedBy: user.uid,
      });
    } catch (updateError) {
      setError(getErrorMessage(updateError));
    }
  };

  if (!user) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Please sign in to access the admin dashboard.
          </p>
          <Link
            to="/auth"
            className="mt-4 inline-flex w-fit items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Go to login
          </Link>
        </Card>
      </section>
    );
  }

  if (!isAdmin) {
    return (
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Admin dashboard
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            You do not have permission to view this page.
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Quote validation
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Review all submitted quotes and validate the ones you approve.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Loading quotes...
        </p>
      ) : error ? (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : quotes.length ? (
        <div className="flex flex-col gap-4">
          {quotes.map((quote) => (
            <Card key={quote.id}>
              <div className="flex flex-col gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {quote.quote}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    — {quote.author}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-wide">
                  <span className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-200">
                    Likes: {quote.likeCount}
                  </span>
                  <span className="rounded-full border border-slate-300 px-3 py-1 text-slate-600 dark:border-slate-700 dark:text-slate-200">
                    {quote.validated ? "Validated" : "Pending validation"}
                  </span>
                </div>
                {!quote.validated ? (
                  <button
                    type="button"
                    onClick={() => handleValidate(quote.id)}
                    className="inline-flex w-fit items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
                  >
                    Validate quote
                  </button>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No quotes found.
        </p>
      )}
    </section>
  );
}
