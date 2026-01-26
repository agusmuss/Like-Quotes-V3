import Card from "./Card";
import { Title, align } from "./Title";

export default function QuoteCard({
  quote,
  author,
  likeCount,
  onLike,
  onNext,
}) {
  return (
    <Card>
      <Title label={quote} align={align.center} />
      <p className="text-right text-sm font-medium text-slate-500 dark:text-slate-400">
        - {author}
      </p>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
        Likes: {likeCount}
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
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
      </div>
    </Card>
  );
}
