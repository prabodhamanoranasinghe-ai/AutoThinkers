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

## Categories

- AI Tools
- Tutorials
- Prompt Craft
- Automation
- Workflows
