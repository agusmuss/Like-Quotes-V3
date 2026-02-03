import { useEffect, useState } from "react";
import Card from "./Card";
import { Title, align } from "./Title";

type QuoteCardProps = {
  quote: string;
  author: string;
  likeCount: number;
  onLike: () => void;
  onNext: () => void;
  canManage: boolean;
  onUpdate: (quote: string, author: string) => Promise<void>;
  onDelete: () => Promise<void>;
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

export default function QuoteCard({
  quote,
  author,
  likeCount,
  onLike,
  onNext,
  canManage,
  onUpdate,
  onDelete,
}: QuoteCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftQuote, setDraftQuote] = useState(quote);
  const [draftAuthor, setDraftAuthor] = useState(author);
  const [actionError, setActionError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    setDraftQuote(quote);
    setDraftAuthor(author);
  }, [quote, author]);

  const handleSave = async () => {
    setIsSaving(true);
    setActionError("");
    try {
      await onUpdate(draftQuote.trim(), draftAuthor.trim());
      setIsEditing(false);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Delete this quote? This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }
    setIsDeleting(true);
    setActionError("");
    try {
      await onDelete();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      {isEditing ? (
        <div className="flex flex-col gap-3">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Quote
            <textarea
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              rows={3}
              value={draftQuote}
              onChange={(event) => setDraftQuote(event.target.value)}
            />
          </label>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
            Author
            <input
              className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              value={draftAuthor}
              onChange={(event) => setDraftAuthor(event.target.value)}
            />
          </label>
        </div>
      ) : (
        <>
          <Title label={quote} align={align.center} />
          <p className="text-right text-sm font-medium text-slate-500 dark:text-slate-400">
            - {author}
          </p>
        </>
      )}
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Likes: {likeCount}
      </p>
      {actionError ? (
        <p className="text-sm text-red-600" role="alert">
          {actionError}
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <button
          type="button"
          onClick={onLike}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          Like
        </button>
        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
        >
          Next quote
        </button>
        {canManage ? (
          isEditing ? (
            <>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-white"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 transition hover:border-red-400 hover:text-red-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-700 dark:bg-slate-900 dark:text-red-400 dark:hover:border-red-500"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </>
          )
        ) : null}
      </div>
    </Card>
  );
}
