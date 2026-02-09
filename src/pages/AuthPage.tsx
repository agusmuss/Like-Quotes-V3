import type { FormEvent } from "react";

export default function AuthPage() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <section className="mx-auto flex w-full max-w-4xl flex-col gap-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Log in to keep your favorite quotes in sync or create a new account.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <form
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Log in
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Use your email and password to continue.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email address
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="login-password"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Password
            </label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              placeholder="********"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Log in
          </button>
        </form>
        <form
          className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-slate-900/5 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Sign up
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              Create an account to personalize your quotes.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-email"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Email address
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="signup-password"
              className="text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Password
            </label>
            <input
              id="signup-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus-visible:outline-slate-500"
              placeholder="Create a password"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white"
          >
            Create account
          </button>
        </form>
      </div>
    </section>
  );
}
