import Image from "next/image";
import { Fragment, type ReactNode } from "react";

export type Tweet = {
  body: string; // raw text; mentions & hashtags get linkified
};

export type TweetThreadProps = {
  tweets: Tweet[];
  authorName: string;
  authorHandle: string;
  authorPfp: string;
  date: string; // free-form, e.g. "Aug 2021"
  /** Optional URL to the original thread (deleted ones stay as plain text) */
  originalUrl?: string;
};

/**
 * Linkify @mentions and #hashtags inside tweet body. URLs are also detected
 * and rendered as anchors. Returns an array of ReactNodes with text + spans.
 */
function linkify(text: string): ReactNode[] {
  // Combined regex: URL | @mention | #hashtag
  const re =
    /(https?:\/\/[^\s]+)|(@[A-Za-z0-9_]+)|(#[A-Za-z0-9_]+)/g;
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(re)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    const token = m[0];
    if (token.startsWith("http")) {
      out.push(
        <a
          key={key++}
          href={token}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[var(--ww-sky)] hover:underline break-all"
        >
          {token}
        </a>,
      );
    } else if (token.startsWith("@")) {
      out.push(
        <a
          key={key++}
          href={`https://twitter.com/${token.slice(1)}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[var(--ww-sky)] hover:underline"
        >
          {token}
        </a>,
      );
    } else if (token.startsWith("#")) {
      out.push(
        <a
          key={key++}
          href={`https://twitter.com/hashtag/${token.slice(1)}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-[var(--ww-sky)] hover:underline"
        >
          {token}
        </a>,
      );
    }
    last = idx + token.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function TweetCard({
  authorName,
  authorHandle,
  authorPfp,
  date,
  body,
  position,
  total,
  showConnector,
}: {
  authorName: string;
  authorHandle: string;
  authorPfp: string;
  date: string;
  body: string;
  position: number;
  total: number;
  showConnector: boolean;
}) {
  const lines = body.split("\n");
  return (
    <div className="relative">
      {/* connector line down to the next tweet */}
      {showConnector && (
        <div className="absolute left-[34px] top-[80px] bottom-[-24px] w-0.5 bg-white/10" />
      )}
      <div className="relative flex gap-3 rounded-2xl border border-white/10 bg-card/60 backdrop-blur-sm p-4 hover:bg-card/80 transition-colors">
        <div className="shrink-0">
          <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10">
            <Image
              src={authorPfp}
              alt={authorName}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm">
            <span className="font-semibold text-foreground truncate">
              {authorName}
            </span>
            <svg
              viewBox="0 0 22 22"
              className="h-4 w-4 shrink-0 text-[var(--ww-sky)]"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.575 1.817.018.647.214 1.276.57 1.817.354.54.854.972 1.44 1.245-.224.607-.272 1.264-.14 1.898.13.633.436 1.218.882 1.687.47.445 1.054.75 1.688.881.634.132 1.29.084 1.897-.139.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.221 1.26.270 1.894.139.634-.131 1.218-.436 1.687-.881.445-.47.749-1.055.88-1.688.131-.634.082-1.29-.141-1.897.586-.273 1.084-.704 1.439-1.245.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z" />
            </svg>
            <span className="text-muted-foreground truncate">
              @{authorHandle}
            </span>
            <span className="text-muted-foreground">·</span>
            <span className="text-muted-foreground shrink-0">{date}</span>
            <span className="ml-auto shrink-0 font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)]">
              {position}/{total}
            </span>
          </div>
          <div className="mt-2 text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">
            {lines.map((line, i) => (
              <Fragment key={i}>
                {linkify(line)}
                {i < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TweetThread({
  tweets,
  authorName,
  authorHandle,
  authorPfp,
  date,
  originalUrl,
}: TweetThreadProps) {
  return (
    <div className="space-y-6">
      {tweets.map((t, i) => (
        <TweetCard
          key={i}
          authorName={authorName}
          authorHandle={authorHandle}
          authorPfp={authorPfp}
          date={date}
          body={t.body}
          position={i + 1}
          total={tweets.length}
          showConnector={i < tweets.length - 1}
        />
      ))}
      {originalUrl && (
        <a
          href={originalUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          View original on X →
        </a>
      )}
    </div>
  );
}
