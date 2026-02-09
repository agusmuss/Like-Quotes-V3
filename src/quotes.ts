export type Quote = {
  id: string;
  quote: string;
  author: string;
  likeCount: number;
  createdBy?: string;
};

export type QuoteInput = {
  quote: string;
  author: string;
};
