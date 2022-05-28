# skytro

Everything you need to build a Svelte project!

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template/wIH6dB?referralCode=OSDU-k)

## Setup

skytro uses [Railway](https://railway.app/) for instant deployments and even local development.

1. Get an railway account, you can use github for this.
2. Click deploy on Railway
3. Install the [Railway CLI](https://docs.railway.app//develop/cli).
4. railway link <railway_id>
5. pnpm prisma migrate deploy 

## Developing

Once you've created a project and installed dependencies with `pnpm install`, start a development server:

**The dev command automatically calls railway run for you, so you have access to your database and other environment variables**

```bash
pnpm dev
```

## Publishing

You can setup different environments inside Railway and connect different branches to them.
Once you push to a branch Railway automatically generates the required production build for you and your app should
be ready within a few minutes.
