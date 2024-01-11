// Borrowed from manifold market repo
// https://raw.githubusercontent.com/manifoldmarkets/manifold/main/common/src/api/market-types.ts

export type LiteMarket = {
  // Unique identifier for this market
  id: string;

  // Attributes about the creator
  creatorId: string;
  creatorUsername: string;
  creatorName: string;
  createdTime: number;
  creatorAvatarUrl?: string;

  // Market attributes. All times are in milliseconds since epoch
  closeTime?: number;
  question: string;
  slug: string;
  url: string;
  outcomeType: string; // BINARY, FREE_RESPONSE, MULTIPLE_CHOICE, NUMERIC, PSEUDO_NUMERIC, BOUNTIED_QUESTION, POLL
  mechanism: string;

  pool?: { [outcome: string]: number };
  probability?: number;
  p?: number;
  totalLiquidity?: number;
  // For pseudo-numeric
  value?: number;
  min?: number;
  max?: number;

  volume: number;
  volume24Hours: number;

  isResolved: boolean;
  resolution?: string;
  resolutionTime?: number;
  resolutionProbability?: number;

  uniqueBettorCount: number;
  lastUpdatedTime?: number;
  lastBetTime?: number;
};

export type ApiAnswer =
  | (DpmAnswer & {
      probability: number;
    })
  | Omit<
      Answer & {
        probability: number;
        pool: { YES: number; NO: number };
      },
      "prob" | "poolYes" | "poolNo"
    >;

export type FullMarket = LiteMarket & {
  // bets?: Bet[]
  // comments?: Comment[]

  // multi markets only
  answers?: ApiAnswer[];
  shouldAnswersSumToOne?: boolean;
  addAnswersMode?: "ANYONE" | "ONLY_CREATOR" | "DISABLED";

  // poll only
  options?: { text: string; votes: number }[];

  // bounty only
  totalBounty?: number;
  bountyLeft?: number;

  description: string | JSON;
  textDescription: string; // string version of description
  coverImageUrl?: string;
  groupSlugs?: string[];
};

export type Answer = {
  id: string;
  index: number; // Order of the answer in the list
  contractId: string;
  userId: string;
  text: string;
  createdTime: number;

  // Mechanism props
  poolYes: number; // YES shares
  poolNo: number; // NO shares
  prob: number; // Computed from poolYes and poolNo.
  totalLiquidity: number; // for historical reasons, this the total subsidy amount added in M
  subsidyPool: number; // current value of subsidy pool in M

  // Is this 'Other', the answer that represents all other answers, including answers added in the future.
  isOther?: boolean;

  resolution?: resolution;
  resolutionTime?: number;
  resolutionProbability?: number;
  resolverId?: string;

  probChanges: {
    day: number;
    week: number;
    month: number;
  };
};

export type DpmAnswer = {
  id: string;
  number: number;
  contractId: string;
  createdTime: number;

  userId: string;
  username: string;
  name: string;
  avatarUrl?: string;

  text: string;
};

export type resolution = "YES" | "NO" | "MKT" | "CANCEL";
