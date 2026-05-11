import type { Metadata } from "next";
import { TopNav } from "@/components/site/TopNav";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { EraCard } from "@/components/site/EraCard";
import { Chapter } from "@/components/site/Chapter";
import { TweetThread } from "@/components/site/TweetThread";
import { MintHeatmap, type MintData } from "@/components/site/MintHeatmap";
import { SellOutClock } from "@/components/site/SellOutClock";
import { SellOutCurve } from "@/components/site/SellOutCurve";
import { LaunchTxCallouts } from "@/components/site/LaunchTxCallouts";
import { TopMinters } from "@/components/site/TopMinters";
import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { MediaGrid, type MediaItem } from "@/components/site/MediaGrid";
import mintData from "@/utils/mint-data.json";

const PRESS: MediaItem[] = [
  {
    outlet: "Business Insider",
    title: "How a 12-year-old earned 106 ethers selling an NFT collection in a day",
    date: "21 Aug 2021",
    url: "https://www.businessinsider.com/ethereum-nft-collection-how-child-earned-ethers-selling-weird-whales-2021-8",
    color: "#10b981",
  },
  {
    outlet: "NYT",
    title: "Teenagers in the NFT World",
    date: "14 Aug 2021",
    url: "https://www.nytimes.com/2021/08/14/style/teens-nft-art.html",
    color: "#e5e7eb",
  },
  {
    outlet: "CNBC Make It",
    title: "12-year-old coder made 6 figures selling Weird Whales NFTs",
    date: "25 Aug 2021",
    url: "https://www.cnbc.com/2021/08/25/12-year-old-coder-made-6-figures-selling-weird-whales-nfts.html",
    color: "#e11d48",
  },
  {
    outlet: "The Telegraph",
    title: "Schoolboy earns nearly £300,000 by selling digital artwork of whales",
    date: "25 Aug 2021",
    url: "https://www.telegraph.co.uk/news/2021/08/25/schoolboy-earns-nearly-300000-selling-digital-artwork-whales/",
    color: "#1e3a8a",
  },
  {
    outlet: "Fortune",
    title: "He's just 12 and has already made over $350,000 selling NFTs",
    date: "26 Aug 2021",
    url: "https://fortune.com/2021/08/26/nft-weird-whale-12-year-old-400000-dollars/",
    color: "#a16207",
  },
  {
    outlet: "ITV News",
    title: "Meet the 12-year-old coder who made £290,000 from selling whale NFTs",
    date: "27 Aug 2021",
    url: "https://www.itv.com/news/2021-08-27/meet-the-12-year-old-coder-who-made-290000-from-selling-whale-nfts",
    color: "#0b1d3a",
  },
  {
    outlet: "BBC News",
    title: "Schoolboy earns $400k from NFTs",
    date: "27 Aug 2021",
    url: "https://www.bbc.co.uk/news/technology-58343062",
    color: "#dc2626",
  },
  {
    outlet: "ARY News",
    title: "Boy, 12, earns around £290,000 by selling digital whale emojis",
    date: "29 Aug 2021",
    url: "https://arynews.tv/benyamin-ahmed-whale-emojis-weird-whales-earning/",
    color: "#0d6efd",
  },
  {
    outlet: "Artnet",
    title: "A 12-Year-Old Made Almost $400,000 Minting NFTs of Whales on His Summer Vacation",
    date: "30 Aug 2021",
    url: "https://news.artnet.com/art-world/art-industry-news-aug-30-2003781",
    color: "#94a3b8",
  },
  {
    outlet: "Forbes",
    title: "NFTs - what the hype is about and where they are headed",
    date: "3 Sep 2021",
    url: "https://www.forbes.com/sites/hannahmayer/2021/09/03/nfts-what-the-hype-is-about-and-where-they-are-headed/",
    color: "#0ea5e9",
  },
  {
    outlet: "BBC: Year in Tech",
    title: "Featured in the BBC's year-end tech round-up of 2021",
    date: "Dec 2021",
    url: "https://www.bbc.co.uk/news/technology-59309768",
    color: "#dc2626",
  },
  {
    outlet: "CNBC Make It",
    title: "12-year-old helped code an NFT collection that made over $5M in 3 weeks",
    date: "1 Oct 2021",
    url: "https://www.cnbc.com/2021/10/01/12-year-old-helped-code-non-fungible-heroes-nfts-that-made-millions.html",
    color: "#e11d48",
  },
  {
    outlet: "CNBC Make It",
    title: "NFT trading volume hit $10.7B last quarter - quoted in the explainer",
    date: "6 Oct 2021",
    url: "https://www.cnbc.com/2021/10/06/nft-trading-volume-hit-10-billion-2-reasons-why-people-are-buying.html",
    color: "#e11d48",
  },
  {
    outlet: "Business Insider",
    title: "WATCH: A 12-year-old explains his NFT process step-by-step",
    date: "Feb 2022",
    url: "https://www.businessinsider.com/how-to-create-nfts-sell-out-one-day-explains-process-2022-2",
    color: "#10b981",
  },
  {
    outlet: "Daily Mail",
    title: "Schoolboy, 12, makes £750,000 selling NFTs",
    date: "7 Mar 2022",
    url: "https://www.dailymail.co.uk/news/article-10584443/Schoolboy-12-makes-750-000-selling-whale-themed-NFTs.html",
    color: "#0c4a6e",
  },
];

const PODCASTS: MediaItem[] = [
  {
    outlet: "Work in Fintech",
    title: "Interview on my NFT journey - first connection with WiF",
    date: "11 Sep 2021",
    url: "https://www.youtube.com/watch?v=nu-JatgwPOI",
    color: "#14b8a6",
  },
  {
    outlet: "The Pomp Podcast",
    title: "Episode #651 - Anthony Pompliano",
    date: "Sep 2021",
    url: "https://www.youtube.com/watch?v=4X4RlgK45mE",
    detail: "983K views, 27K likes - one of the most-watched on the channel.",
    color: "#f97316",
  },
  {
    outlet: "Crypto Café",
    title: "Randi Zuckerberg - SiriusXM podcast",
    date: "Oct 2021",
    url: "https://open.spotify.com/show/5p34SimqH4WWs6zHTiKIqt",
    color: "#6366f1",
  },
  {
    outlet: "BBC East",
    title: "Live radio interview - morning of 31 Aug 2021",
    date: "31 Aug 2021",
    url: "https://www.bbc.co.uk/news/technology-58343062",
    color: "#dc2626",
  },
  {
    outlet: "BBC My World",
    title: '"I made a considerable sum of money off NFTs"',
    date: "Mar 2022",
    url: "https://www.youtube.com/watch?v=V37JnekfwbU",
    color: "#dc2626",
  },
  {
    outlet: "The Pomp Podcast",
    title: "The 13 Year Old Crypto GENIUS Known World Wide",
    date: "14 Apr 2022",
    url: "https://www.youtube.com/watch?v=AVY6V9Tqtck",
    detail: "Returned by audience demand a year after the first appearance.",
    color: "#fb923c",
  },
  {
    outlet: "I'm New Here",
    title: "Featured cast member in an unreleased NFT documentary",
    date: "Apr 2022",
    url: "https://newhere.xyz/cast",
    color: "#9333ea",
  },
  {
    outlet: "BBC Radio 4",
    title: "Sunil Patel: An Idiot's Guide to Cryptocurrency",
    date: "Jan 2023",
    url: "https://www.bbc.co.uk/programmes/m0017chv/episodes/guide",
    detail: "Recurring guest in a three-part comedy series. Fully unscripted.",
    color: "#b91c1c",
  },
];

const SPEAKING: MediaItem[] = [
  {
    outlet: "Oxford · Pembroke",
    title: "Youngest-ever guest speaker in Pembroke's 400-year history",
    date: "May 2022",
    url: "https://www.youtube.com/watch?v=XHUWaLcLau8",
    detail: "Lecture: Art and Culture in a Digital Universe.",
    color: "#1e40af",
  },
  {
    outlet: "NFC Summit · Lisbon",
    title: "On NFTs and my journey as a young builder",
    date: "May 2022",
    url: "https://www.youtube.com/watch?v=HxdBiJYxIPw",
    color: "#0891b2",
  },
  {
    outlet: "NFT.NYC 2022",
    title: "I Don't Want to Own Any Physical Assets",
    date: "Jun 2022",
    url: "https://www.youtube.com/watch?v=ORHkkYPrZms",
    detail: "A Harbinger of the Future with NFTs.",
    color: "#ec4899",
  },
  {
    outlet: "NFT.London 2022",
    title: "Voted Top 5 Favourite Speaker out of 819",
    date: "Nov 2022",
    url: "https://www.youtube.com/watch?v=xu05BGAt6wY",
    detail: "Audience-voted across the entire event.",
    color: "#be185d",
  },
  {
    outlet: "Oxford · Magdalen",
    title: "Invited back to Oxford for a second engagement",
    date: "Feb 2023",
    url: "https://en.wikipedia.org/wiki/Magdalen_College,_Oxford",
    color: "#1d4ed8",
  },
  {
    outlet: "Univ. of East London",
    title: "Talk on my journey into NFTs",
    date: "Mar 2023",
    url: "https://www.uel.ac.uk/",
    color: "#059669",
  },
];

export const metadata: Metadata = {
  title: "The Story",
  description:
    "How Weird Whales came to be - the launch, the viral thread, the sell-out, and everything since. Told in eras.",
};

const VIRAL_THREAD = [
  {
    body: `🧵 thread on how I launched my NFT with a custom smart contract and minting webpage.
(For those that don't know, I'm 12 and still at school 🏫).`,
  },
  {
    body: `Background: started coding early around 5/6 years old. Dad is a programmer and got me started with HTML, CSS and Bootstrap. Built really really simple web pages with Bootstrap components and did lots of inspect element on websites to see how they are built. 🕵️‍♂️`,
  },
  {
    body: `Completed @freeCodeCamp JavaScript course before my 10th birthday. Moved onto @codewars, currently ranked 4kyu but find them too difficult, can manage 7kyu. Will continue with @codewars until I hit 1 kyu 🥊.`,
  },
  {
    body: `Learned about Bitcoin and Ethereum from dad and his friends. Found #NFTs originally interesting as an online flex 💪 and also loved the artwork. Spent way too many hours playing @Minecraft, Shell Shockers (@eggcombat) and @FortniteGame. I can see #NFTs becoming huge in gaming. Imagine owning your own custom characters and cosmetics 🤩. With billions of gamers, a huge market! 🚀`,
  },
  {
    body: `Created my first NFT set on OpenSea, 40 images in Photoshop before I got tired 🥱. Dad told me that there is an automated way to generate thousands of images. Still had not bought my first #NFT.`,
  },
  {
    body: `Created a concept around #WeirdWhales inspired by CryptoPunks (@larvalabs) for my second #NFT project. Came across the @BoringBananasCo tweet on image creation. Joined their discord and @thedigitalvee kindly sent a Python script with comments. This was key 🗝️. @thedigitalvee also sent me my first three NFTs 😍. Since then I bought @ElephantNFTS #3647 and an ENS domain.

https://opensea.io/Benoni`,
  },
  {
    body: `Generated my images, created a website and got help from dad with the difficult bits. Useful resources 😍🙏:
@BoringBananasCo Github Repository
@BoringBananasCo Twitch videos
Bulma for styling website
Vercel tutorials for deploying website
@Replit - favourite online code editor.`,
  },
  {
    body: `Things I needed help with but looking to learn more: Solidity, IPFS, DNS setup, smart contracts on #Ethereum.`,
  },
  {
    body: `Costs 💰💰:
Deploy contract: $124
Set base URI on contract: $3
Mint tokens for #NFTGiveaways: 0.25 Ξ (Gas: 14 Gwei)
Purchasing domain name: $80`,
  },
  {
    body: `Things I needed help with but looking to learn more: Solidity, IPFS, DNS setup, smart contracts on #Ethereum.

If you found this thread helpful, please:
1. Retweet the 1st tweet 🔥
2. Feel free to follow @ObiWanBenoni 👍✨.

Massive thanks to all those that helped.
 #WeirdWhales => weirdwhalesnft.com 🐋🚀🌑`,
  },
];

export default function StoryPage() {
  return (
    <>
      <TopNav />

      <main className="flex-1 overflow-x-hidden">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 py-20 md:py-28 text-center">
            <Reveal>
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-pink)] mb-5">
                · The Story
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 className="font-pixel text-4xl leading-[1.1] tracking-[0.04em] sm:text-5xl md:text-6xl">
                <span className="block text-foreground">RELIVE</span>
                <span className="block text-gradient-ww">THE STORY</span>
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
                How Weird Whales came to be.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ERAS */}
        <section className="mx-auto max-w-5xl px-4 pb-24 md:pb-32 space-y-32 md:space-y-40">
          {/* ERA 01 - The Launch */}
          <EraCard
            index={1}
            title="The Launch"
            dateRange="Summer 2021"
            pfp="/pfp/01-launch-era.png"
            pfpAlt="Benyamin's pre-success PFP"
            accent="pink"
            blurb="From bedroom coder to viral sell-out in a single afternoon."
          >
            <div className="space-y-16">
              <Chapter
                title="Before The Wave"
                dateRange="Pre · Summer 2021"
                accent="pink"
                blurb="12 years old. Coding since 5. A big fan of Pokémon and games like Minecraft and Fortnite."
              >
                <Prose>
                  <p>
                    When I was 5, my dad, a software engineer, would often
                    come home from work, pull out his laptop and start
                    coding. Me and my brother were curious as to what he
                    was doing, so he eventually started teaching us the
                    basics of HTML, CSS and JavaScript. I finished
                    freeCodeCamp&apos;s JavaScript course before my 10th
                    birthday, then started on a daily coding regime,
                    completing a Codewars kata every day, in which I now
                    rank 3 kyu - which represents the top 0.43% of
                    developers on the platform.
                  </p>
                  <p>
                    In the run-up to the summer holidays of 2021, I came
                    across the world of NFTs through my dad&apos;s friend. He
                    had been a big and early investor in Bitcoin, and I found
                    out that he had just spent $27,000 on an NFT known as a
                    Rare Pepe. I was shocked at the time to learn that
                    someone was willing to spend that much money on what
                    seemed to me like just a JPEG. I started learning about the
                    technology, and it taught me a lot about the future of
                    digital ownership and how it could extend beyond art to
                    power the digital property rights of the entire
                    internet.
                  </p>
                  <p>
                    I figured the best way to really learn was to build in
                    the space and gain real experience, so I created 40
                    hand-made Minecraft-inspired pixel-art characters and
                    manually uploaded them to OpenSea. I didn&apos;t sell
                    any, but it taught me how the NFT ecosystem worked
                    end-to-end: smart contracts, marketplaces, community,
                    metadata. Everything I learned went straight into what
                    came next.
                  </p>
                </Prose>
                <figure className="mt-6 rounded-2xl border border-white/10 bg-card/40 p-3 backdrop-blur-sm overflow-hidden max-w-xl">
                  <Image
                    src="/story/discord-vee.png"
                    alt="Discord conversation between ObiWanBenoni and Vee on 9 July 2021, where Vee shares the BANANA_GENERATION_2.ipynb Python notebook"
                    width={580}
                    height={530}
                    className="rounded-lg w-full h-auto"
                  />
                  <figcaption className="mt-2 px-1 font-pixel text-[9px] tracking-[0.2em] uppercase text-muted-foreground">
                    · The DM with @thedigitalvee · 9 Jul 2021
                  </figcaption>
                </figure>
              </Chapter>

              <Chapter
                title="The Launch Thread"
                dateRange="19 Jul 2021"
                accent="orange"
                blurb="The thread that put the project on the map."
              >
                <div className="space-y-6">
                  <Prose>
                    <p>
                      On launch day I posted a 10-tweet thread breaking down
                      exactly how I built the collection. It went viral
                      within hours, amassing over 2k likes. The original
                      mint site is still preserved at{" "}
                      <a
                        href="https://weirdwhalesnft.com"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="text-[var(--ww-sky)] hover:underline"
                      >
                        weirdwhalesnft.com
                      </a>
                      .
                    </p>
                  </Prose>
                  <TweetThread
                    tweets={VIRAL_THREAD}
                    authorName="Benyamin Ahmed"
                    authorHandle="ObiWanBenoni"
                    authorPfp="/pfp/01-launch-era.png"
                    date="19 Jul 2021"
                  />
                </div>
              </Chapter>

              <Chapter
                title="Sell-Out / Gas War"
                dateRange="19 Jul 2021"
                accent="yellow"
                blurb="11.5 hours from the first mint to a sell-out gas war."
              >
                <div className="space-y-6">
                  <Prose>
                    <p>
                      For most of the day, there was a few mints here and
                      there. As usual, at night, I decided to go sleep.
                      What I didn&apos;t realise was that the USA were just
                      starting to wake up. The thread broke through and the
                      crowd showed up: 35 mints, 63, then 135 in a single
                      5-minute window.
                    </p>
                    <p>
                      At peak, <strong>241 transactions</strong> tried to
                      land in one 5-minute window - but only 88 cleared. The
                      rest reverted in a gas war that ended the sale.
                    </p>
                  </Prose>
                  {mintData.totalMintAttempts > 0 ? (
                    <div className="space-y-6">
                      <Link
                        href="/replay"
                        className="group flex items-center gap-4 rounded-2xl border border-[var(--ww-yellow)]/30 bg-[var(--ww-yellow)]/5 p-5 transition-all hover:bg-[var(--ww-yellow)]/10 hover:-translate-y-0.5"
                      >
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-[var(--ww-yellow)] text-black">
                          <Play className="h-5 w-5" fill="currentColor" />
                        </div>
                        <div className="flex-1">
                          <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-yellow)] mb-1">
                            · Replay it
                          </div>
                          <div className="text-sm text-foreground">
                            Watch every whale appear chronologically - the
                            slow trickle, the surge, the gas war.
                          </div>
                        </div>
                        <span className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground group-hover:text-foreground">
                          open →
                        </span>
                      </Link>
                      <MintHeatmap data={mintData as MintData} />
                      {mintData.firstMintTx && mintData.lastMintTx && (
                        <LaunchTxCallouts
                          firstMint={mintData.firstMintTx}
                          lastMint={mintData.lastMintTx}
                          firstRevert={mintData.firstRevertTx}
                        />
                      )}
                      {mintData.milestones && mintData.windowStart && (
                        <SellOutClock
                          milestones={mintData.milestones}
                          windowStart={mintData.windowStart}
                        />
                      )}
                      {mintData.totalWhalesMinted ? (
                        <SellOutCurve
                          buckets={mintData.buckets as MintData["buckets"]}
                          totalWhales={mintData.totalWhalesMinted}
                        />
                      ) : null}
                      {mintData.topMinters && (
                        <TopMinters minters={mintData.topMinters} />
                      )}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-card/30 p-10 text-center">
                      <p className="font-pixel text-[11px] tracking-[0.2em] uppercase text-muted-foreground">
                        · Mint heatmap pending Etherscan data
                      </p>
                      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                        Add a free Etherscan API key to{" "}
                        <span className="font-mono">.env.local</span> as{" "}
                        <span className="font-mono">ETHERSCAN_API_KEY=…</span>,
                        then run{" "}
                        <span className="font-mono">
                          node scripts/fetch-mint-data.mjs
                        </span>{" "}
                        - this section fills in with the real launch surge.
                      </p>
                    </div>
                  )}
                </div>
              </Chapter>

              <Chapter
                title="The Storm"
                dateRange="Late Jul - Aug 2021"
                accent="purple"
              >
                <Prose>
                  <p>
                    Once the collection sold out, rumours started
                    circulating as to whether a 12-year-old had actually
                    written the contract, generated the art, and shipped
                    the mint site. Despite my GitHub being public for years
                    and my YouTube channel teaching others code dating back
                    to when I was 10, the suspicion continued and morphed
                    into something stranger - some were wondering if
                    I&apos;d hijacked the identity of the &ldquo;real&rdquo;
                    Benyamin Ahmed and was fronting work that wasn&apos;t
                    mine.
                  </p>
                  <p>
                    To answer it, I filmed a Q&amp;A directly addressing
                    every question being thrown around and uploaded it to
                    YouTube. I then went on my first-ever Twitter Space -
                    joint with{" "}
                    <a
                      href="https://twitter.com/BoringBananasCo"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[var(--ww-sky)] hover:underline"
                    >
                      @BoringBananasCo
                    </a>{" "}
                    - so people could hear me talk in real time.
                  </p>
                  <p>
                    My confirmation was well received and the collection
                    continued to soar.
                  </p>
                </Prose>
                <div className="grid gap-3 sm:grid-cols-2 mt-6">
                  <a
                    href="https://www.youtube.com/watch?v=19QQ5hQlb-s"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                  >
                    <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-pink)] mb-2">
                      Q&A video
                    </div>
                    <div className="text-sm font-medium">
                      Answering the &ldquo;is it really him?&rdquo;
                      skepticism
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      YouTube · the direct response
                    </div>
                  </a>
                  <a
                    href="https://www.youtube.com/watch?v=AbZAiUZ5Bnc"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="group rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm hover:-translate-y-0.5 transition-all"
                  >
                    <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-[var(--ww-purple)] mb-2">
                      Twitter Space
                    </div>
                    <div className="text-sm font-medium">
                      My first-ever Twitter Space - joint with Boring
                      Bananas Co.
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">
                      Live conversation · let people hear me think
                    </div>
                  </a>
                </div>
              </Chapter>
            </div>
          </EraCard>

          {/* ERA 02 - Going Public */}
          <EraCard
            index={2}
            title="Going Public"
            dateRange="Aug 2021 - Mar 2023"
            pfp="/pfp/02-media-era.JPG"
            pfpAlt="The PFP that ran in BBC, CNBC, ITV thumbnails for months"
            pfpPosition="30% center"
            accent="pink"
            blurb="What happened when the world found out."
          >
            <div className="space-y-16">
              <Chapter
                title="Front Page Everywhere"
                dateRange="Aug 2021 - Mar 2022"
                accent="pink"
                blurb="Within weeks the story was on the BBC, CNBC, ITV, NYT, Forbes, Fortune, the Telegraph, the Daily Mail, Artnet, and international outlets from ARY News in Pakistan to Portuguese press."
              >
                <MediaGrid items={PRESS} />
              </Chapter>

              <Chapter
                title="On The Mic"
                dateRange="Sep 2021 - Jan 2023"
                accent="orange"
                blurb="The print pieces led to interviews. Pomp, Randi Zuckerberg, BBC Radio."
              >
                <MediaGrid items={PODCASTS} />
              </Chapter>

              <Chapter
                title="Building On"
                dateRange="Sep 2021 - Jan 2022"
                accent="teal"
              >
                <Prose>
                  <p>
                    I open-sourced the{" "}
                    <a
                      href="https://github.com/benyaminahmed/nft-image-generator"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[var(--ww-sky)] hover:underline"
                    >
                      Python image generator
                    </a>{" "}
                    I built for Weird Whales - to date it has gained 1,600+
                    stars and 490+ forks on GitHub, becoming a starting
                    point for other generative collections.
                  </p>
                  <p>
                    I launched the{" "}
                    <a
                      href="https://discord.gg/UJ348eqzsj"
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-[var(--ww-sky)] hover:underline"
                    >
                      Weird Whales Discord
                    </a>{" "}
                    on 14 September 2021. It has since grown to over 2.1k
                    members and I&apos;m still in there today replying to
                    questions.
                  </p>
                </Prose>
                <div className="grid gap-3 sm:grid-cols-2 mt-6">
                  <Stat
                    label="GitHub stars"
                    value="1,600+"
                    accent="var(--ww-yellow)"
                  />
                  <Stat
                    label="Discord members"
                    value="2,100+"
                    accent="var(--ww-purple)"
                  />
                </div>
              </Chapter>

              <Chapter
                title="On Stage"
                dateRange="May 2022 - Mar 2023"
                accent="sky"
                blurb="Oxford (twice). NFT.NYC. NFT.London (top 5 of 819). Lisbon. UEL."
              >
                <MediaGrid items={SPEAKING} />
              </Chapter>
            </div>
          </EraCard>

        </section>

        {/* CLOSING - embedded in history */}
        <section className="mx-auto max-w-5xl px-4 pb-24 md:pb-32">
          <Reveal>
            <div className="text-center mb-10">
              <div className="font-pixel text-[10px] tracking-[0.2em] uppercase text-[var(--ww-purple)] mb-3">
                · Since then
              </div>
              <h2 className="font-pixel text-2xl tracking-[0.04em] md:text-3xl">
                EMBEDDED IN{" "}
                <span className="text-gradient-ww">CRYPTO HISTORY</span>
              </h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
                People still reminiscing, years on.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-black">
              {/* Crop ~8% off the top + bottom by giving the wrapper a tighter
                  aspect ratio than the source and letting the video object-cover. */}
              <div className="relative w-full aspect-[16/7] overflow-hidden">
                <video
                  src="/story/ww_chat.mp4"
                  autoPlay
                  muted
                  playsInline
                  controls
                  className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
                />
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-tweetable space-y-4 text-[15px] leading-relaxed text-foreground/90">
      {children}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-card/50 p-4 backdrop-blur-sm">
      <div
        className="font-pixel text-[10px] tracking-[0.18em] uppercase mb-2"
        style={{ color: accent }}
      >
        {label}
      </div>
      <div className="font-pixel text-2xl text-foreground">{value}</div>
    </div>
  );
}

