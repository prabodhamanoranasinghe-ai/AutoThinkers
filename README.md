# AutoThinkers

Practical **AI tools & tutorials** for creators, founders, and solo operators.

**Live:** https://autothinkers.com  
**GitHub Pages fallback:** https://prabodhamanoranasinghe-ai.github.io/AutoThinkers/

## Custom domain DNS (Namecheap)

The domain must point at GitHub Pages — not Namecheap parking.

1. In Namecheap → **Domain List** → **Manage** → **Domain** tab:
   - Turn **OFF** Redirect / URL forwarding / parking page
2. Open **Advanced DNS** and set only these host records:

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `prabodhamanoranasinghe-ai.github.io.` | Automatic |

3. Delete any old A/CNAME/URL Redirect records that point to parking or forwarding.
4. In GitHub → **Settings → Pages → Custom domain**: `autothinkers.com`
   - Enable **Enforce HTTPS** after DNS checks pass (can take up to 24h, often sooner)

Verify:

```bash
dig +short autothinkers.com A
# should return the four 185.199.x.x addresses

dig +short www.autothinkers.com CNAME
# should return prabodhamanoranasinghe-ai.github.io.
```

## Quick start

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Publishing new tutorials

1. **Best:** send a topic or tool link in chat — we write Markdown into `content/posts/` and push
2. **Manual:** add `content/posts/your-slug.md` and push to `main`
3. Actions rebuilds and updates GitHub Pages

See `content/editorial-calendar.md` for the full topic queue (2–3 posts/day across Students, Business, ChatGPT, Productivity, Content, Trends, Comparisons, and Pillars).

### Internal linking (for reach)

Every article should help readers discover the rest of the archive:

- **Automatic:** each post page shows a **Related Articles** block (up to 8 posts) scored by tags, keywords, and category
- **In the Markdown:** end each post with a `## Related Articles` section linking **5–10** related guides (use trailing-slash paths like `/blog/your-slug/`)
- **New drafts:** the admin draft generator already appends a Related Articles list from existing posts — keep or curate those links before publish

## Traffic / analytics

Firebase Analytics is installed on the site (`measurementId: G-QLRDQZ9SDF`).

View traffic in Firebase Console → **Analytics** → **Dashboard**  
(or Google Analytics property linked to that Measurement ID).

Add these authorized domains in Firebase Authentication / App settings if prompted:
- `autothinkers.com`
- `www.autothinkers.com`
- `prabodhamanoranasinghe-ai.github.io`

### Get discovered by Google (required for organic visitors)

Publishing alone does not create traffic. Do this once:

1. Open [Google Search Console](https://search.google.com/search-console)
2. Add property `https://autothinkers.com`
3. Verify ownership (DNS TXT at Namecheap, or HTML tag — set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` in the deploy workflow if you use the meta tag)
4. Submit sitemap: `https://autothinkers.com/sitemap.xml`
5. Use **URL Inspection → Request indexing** on your best 3–5 posts
6. Share posts on LinkedIn / X / Reddit / Facebook groups (Google needs backlinks + time)

Expect first organic clicks after indexing — often days to a few weeks for a new domain.
