export interface Market {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  createdTime: number;
  creatorAvatarUrl: string;
  closeTime?: number;
  question: string;
  slug: string;
  url: string;
  pool?: Pool;
  probability?: number;
  p?: number;
  totalLiquidity?: number;
  outcomeType: string;
  mechanism: string;
  volume: number;
  volume24Hours: number;
  isResolved: boolean;
  resolution?: string;
  resolutionTime?: number;
  resolutionProbability?: number;
  uniqueBettorCount: number;
  lastUpdatedTime: number;
  lastBetTime?: number;
  lastCommentTime?: number;
  resolverId?: string;
}

export interface Pool {
  NO: number;
  YES: number;
}

export async function searchManifold(term: string) {
  const searchParams = new URLSearchParams();
  searchParams.append("term", term);

  const response = await fetch(
    `https://api.manifold.markets/v0/search-markets?${searchParams.toString()}`
  );

  const result = (await handleErrors(response).json()) as Market[];

  return result;
}

const handleErrors = (response: Response) => {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
};
