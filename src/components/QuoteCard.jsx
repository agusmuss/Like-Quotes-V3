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
      <p className="author">{author}</p>
      <p className="likes">Likes: {likeCount}</p>
      <div className="actions">
        <button type="button" onClick={onLike}>
          Like
        </button>
        <button type="button" onClick={onNext}>
          Next quote
        </button>
      </div>
    </Card>
  );
}
