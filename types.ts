
export enum GameMode {
  BATTLE_ROYALE = 'Battle Royale',
  CLASH_SQUAD = 'Clash Squad'
}

export enum TeamMode {
  SOLO = 'Solo',
  DUO = 'Duo',
  SQUAD = 'Squad'
}

export enum MapType {
  BERMUDA = 'Bermuda',
  PURGATORY = 'Purgatory',
  KALAHARI = 'Kalahari',
  ALPINE = 'Alpine',
  NEEXTERRA = 'Neexterra'
}

export enum TournamentStatus {
  UPCOMING = 'Upcoming',
  LIVE = 'Live',
  COMPLETED = 'Completed'
}

export enum PaymentStatus {
  PENDING = 'Pending',
  SUCCESS = 'Success',
  FAILED = 'Failed'
}

export type PaymentMethod = 'bKash' | 'Nagad';

export interface Rule {
  id: string;
  title: string;
  content: string;
}

export interface BannedPlayer {
  id: string;
  name: string;
  uid: string;
  proof: string;
  message: string;
  date: string;
}

export interface PaymentRequest {
  id: string;
  userUid: string;
  amount: number;
  method: PaymentMethod;
  transactionId: string;
  senderNumber?: string;
  status: PaymentStatus;
  date: string;
  type: 'DEPOSIT' | 'WITHDRAW';
  accountNumber?: string;
}

export interface User {
  uid: string;
  ign: string;
  email: string;
  passwordHash: string;
  isAdmin?: boolean;
  balance: number;
  totalWinnings: number;
  isBlocked?: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  date: string;
  time: string;
  checkInTime: string;
  mode: GameMode;
  teamMode: TeamMode;
  map: MapType;
  status: TournamentStatus;
  totalSlots: number;
  registeredUids: string[];
  rules: string[];
  prizePool: string;
  entryFee: number;
  winners?: string[];
  roomID?: string;
  roomPassword?: string;
}

export type ViewState = 'AUTH' | 'DASHBOARD' | 'DETAILS' | 'PROFILE' | 'ADMIN' | 'WALLET' | 'RULES';
