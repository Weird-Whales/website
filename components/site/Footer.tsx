import { routes } from "@/utils/routes";
import { ExternalLink } from "lucide-react";
import { Logo } from "./Logo";
import { TwitterIcon, DiscordIcon, GithubIcon } from "./BrandIcons";
import { CurrencySwitcher } from "./CurrencySwitcher";

const socials = [
  { href: routes.external.WWTwitter, label: "Twitter / X", Icon: TwitterIcon },
  { href: routes.external.WWDiscord, label: "Discord", Icon: DiscordIcon },
  { href: routes.external.WWGithub, label: "GitHub", Icon: GithubIcon },
];

const links = [
  { href: routes.external.openSeaWWHome, label: "OpenSea" },
  { href: routes.external.Etherscan, label: "Etherscan" },
  { href: routes.external.IPFSImage, label: "IPFS" },
  { href: routes.internal.provenance, label: "Provenance" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-black/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-start md:justify-between md:text-left">
          <div className="space-y-3 max-w-sm">
            <div className="flex justify-center md:justify-start">
              <Logo size={32} />
            </div>
            <p className="text-sm text-muted-foreground">
              3,350 generative pixel-art whales swimming on the Ethereum
              blockchain.
            </p>
          </div>

          <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-4 md:justify-start">
            <div>
              <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
                Links
              </div>
              <ul className="space-y-1.5 text-sm">
                {links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="font-pixel text-[10px] tracking-[0.18em] uppercase text-muted-foreground mb-3">
                Community
              </div>
              <ul className="flex justify-center gap-2 md:justify-start">
                {socials.map(({ href, label, Icon }) => (
                  <li key={href}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={label}
                      className="grid h-9 w-9 place-items-center rounded-md border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:bg-[var(--ww-pink)] hover:border-[var(--ww-pink)] transition-colors"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 space-y-4">
          <div className="flex justify-center md:justify-start">
            <CurrencySwitcher />
          </div>
          <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Weird Whales.
            </p>
            <p className="font-pixel text-[9px] tracking-[0.18em] uppercase text-muted-foreground">
              Ξ&nbsp;ETHEREUM&nbsp;·&nbsp;3350&nbsp;NFTS
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
