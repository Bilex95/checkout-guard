# checkout-guard

**The problem:** checkout pages are where bugs cost actual money — a broken promo code field or a mis-calculated total loses real sales. Yet most testing tutorials test toy todo apps instead of the flows that matter.

**The solution:** a realistic single-page checkout (cart summary, quantity controls, promo code, order total) plus a Playwright suite written the way you'd write it for production: role-based selectors, no arbitrary waits, and assertions on the money.

## Run it

```bash
npm init -y
npm i -D @playwright/test
npx playwright install chromium
npx playwright test
```

The suite serves `checkout.html` from disk — no server needed.

## What the tests cover

- Quantity increase/decrease updates line totals and the grand total
- The promo code `SAVE10` applies a 10% discount, invalid codes show an error
- Removing the last item shows the empty-cart state
- **One test fails on purpose** — see the good first issue

## How it's built

The page is vanilla JS with prices stored in integer kobo/cents (floating point money bugs are the classic checkout regression). Tests use `getByRole` and `getByLabel` exclusively — if a selector breaks, the page's accessibility broke too, which is exactly what you want a suite to catch.

## Contribute

- Add a test for promo codes being case-insensitive (they currently aren't — is that a bug or a spec?)
- Add a visual regression snapshot of the order summary
- Add keyboard-only checkout coverage (tab order + Enter to apply promo)

---

Scaffolded by an automated weekly pipeline, then refined by hand — see the factory repo for how it works.
