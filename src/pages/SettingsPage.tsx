import { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

export default function SettingsPage() {
  const { user, updateUserEmail, deleteAccount } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [deleteText, setDeleteText] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!user) {
    return (
      <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-white/80 p-6 text-center text-sm text-slate-600 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300">
        Please sign in to manage your account settings.
      </section>
    );
  }

  const handleEmailSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailError("");
    setEmailSuccess("");
    setIsUpdating(true);
    try {
      await updateUserEmail(email.trim());
      setEmailSuccess("Email updated successfully.");
    } catch (error) {
      setEmailError(getErrorMessage(error));
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDeleteError("");
    setDeleteSuccess("");

    if (deleteText.trim().toLowerCase() !== "delete") {
      setDeleteError("Type DELETE to confirm account removal.");
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      setDeleteSuccess("Account deleted.");
    } catch (error) {
      setDeleteError(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Account settings
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Update your email address or permanently delete your account.
        </p>
      </div>

      <form
        className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
        onSubmit={handleEmailSubmit}
      >
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Update email
        </h2>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Email address
          <input
            className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            type="email"
            required
          />
        </label>
        {emailError ? (
          <p className="text-sm text-red-600" role="alert">
            {emailError}
          </p>
        ) : null}
        {emailSuccess ? (
          <p className="text-sm text-emerald-600" role="status">
            {emailSuccess}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isUpdating}
          className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
        >
          {isUpdating ? "Updating..." : "Save email"}
        </button>
      </form>

      <form
        className="flex flex-col gap-4 rounded-2xl border border-red-200 bg-white/80 p-6 shadow-lg shadow-red-500/10 backdrop-blur dark:border-red-800 dark:bg-slate-900/80"
        onSubmit={handleDeleteSubmit}
      >
        <h2 className="text-lg font-semibold text-red-600">Delete account</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          This action permanently removes your account and cannot be undone.
          Type DELETE to confirm.
        </p>
        <input
          className="w-full rounded-lg border border-red-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 dark:border-red-700 dark:bg-slate-900 dark:text-slate-100"
          value={deleteText}
          onChange={(event) => setDeleteText(event.target.value)}
          placeholder="DELETE"
          aria-label="Type DELETE to confirm"
        />
        {deleteError ? (
          <p className="text-sm text-red-600" role="alert">
            {deleteError}
          </p>
        ) : null}
        {deleteSuccess ? (
          <p className="text-sm text-emerald-600" role="status">
            {deleteSuccess}
          </p>
        ) : null}
        <button
          type="submit"
          disabled={isDeleting}
          className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete account"}
        </button>
      </form>
    </section>
  );
}
