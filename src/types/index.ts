export interface TrackLayout {
  id: string;
  name: string;
}

export interface Track {
  id: string;
  name: string;
  region: string;
  trackMapUrl: string | null;
  layouts: TrackLayout[];
}

export interface Event {
  id: number;
  trackId: string;
  trackName: string;
  trackLayoutId: string;
  organiserId: string;
  organiserName: string;
  eventName: string;
  startDatetime: string;
  endDatetime: string | null;
  bookingUrl: string;
  sessionType: string | null;
  noiseLimitStaticDecibels: number | null;
  noiseLimitDriveByDecibels: number | null;
  isSoldOut: boolean;
  source: string;
  lastScrapedAt: string;
  isVerified: boolean;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}
