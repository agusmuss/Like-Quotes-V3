import { useState } from "react";
import type { FormEvent } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

export default function CreateQuotePage() {
  const { user } = useAuth();
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Card>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Create a new quote
          </h1>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            You need to be signed in to add a quote.
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const trimmedQuote = quote.trim();
    const trimmedAuthor = author.trim();

    if (!trimmedQuote || !trimmedAuthor) {
      setError("Please fill in both the quote and author.");
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "quotes"), {
        quote: trimmedQuote,
        author: trimmedAuthor,
        likeCount: 0,
        createdBy: user.uid,
        validated: false,
        createdAt: serverTimestamp(),
      });
      setQuote("");
      setAuthor("");
      setSuccess("Quote submitted. It will appear once validated.");
    } catch (submitError) {
      setError(getErrorMessage(submitError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Create a new quote
        </h1>
        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          Share a favorite quote and we will publish it after validation.
        </p>
      </div>

      <Card>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Quote
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              rows={4}
              value={quote}
              onChange={(event) => setQuote(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Author
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="text-sm text-emerald-600" role="status">
              {success}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            {isSaving ? "Submitting..." : "Submit quote"}
          </button>
        </form>
      </Card>
    </section>
  );
}
