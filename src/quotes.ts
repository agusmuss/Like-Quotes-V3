export type Quote = {
  id: string;
  quote: string;
  author: string;
  likeCount: number;
  createdBy?: string;
  validated?: boolean;
};

export type QuoteInput = {
  quote: string;
  author: string;
};
