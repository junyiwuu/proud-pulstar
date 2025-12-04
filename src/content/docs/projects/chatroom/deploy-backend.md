---
title: Deploy Backend
---





**Run docker:**
Dont use nvidia runtime

```
docker run --runtime=runc -it --rm \
  -v $(pwd):/app \
  -w /app \
  node:20 bash
```
download cloudflare wrangler
`npm install -g wrangler`
`wrangler deploy`: This will attempt to login via OAuth, deploys your backend to cloudflare, and runs on the edge globally
> 1. Check who you are
> 2. Connect to Cloudflare API
> 3. Get a token stored locally inside `~/.config/wrangler/`

Now: connect to cloudflare in docker (because my current machine doesnt have latest lib something), save the token locally, then exit


mount the folder to save the token 
```
-v $HOME/.config/wrangler:/root/.config/wrangler
```

```bash
docker run --runtime=runc -it --rm \
  -v $(pwd):/app \
  -v $HOME/.config/wrangler:/root/.config/wrangler \
  -w /app \
  node:20 bash
```




Wrangler stores authentication tokens in:

`~/.config/wrangler/`

Inside Docker, this is **inside the container**, not on your host machine.

If you don’t mount that folder, the login disappears after the container exits.

You _can_ persist login by mounting it:

`-v $HOME/.config/wrangler:/root/.config/wrangler`

Then you won't need to login again.








---
Yes, you are exactly right. The default `wrangler login` command relies on opening a browser and receiving a callback to `localhost`, which fails inside a Docker container because the container cannot "catch" the redirect from your host machine's browser.

To bypass this, you should use an **API Token** authentication method instead of the browser-based login.

Here is the step-by-step solution to fix this:

### Step 1: Create an API Token

You need to generate a specific token in your Cloudflare dashboard that Wrangler can use to authenticate silently.

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens).
    
2. Go to **My Profile** > **API Tokens**.
    
3. Click **Create Token**.
    
4. Find the **Edit Cloudflare Workers** template and click **Use template**.
    
    - _This template usually has the correct permissions pre-selected (Workers Scripts: Edit, Account: Read, etc.)._
        
5. Under **Account Resources**, select your specific account (or "All accounts").
    
6. Click **Continue to summary** -> **Create Token**.
    
7. **Copy this token immediately**; you won't be able to see it again.
    

### Step 2: Pass the Token to Docker

Wrangler automatically looks for an environment variable named `CLOUDFLARE_API_TOKEN`. If this variable is present, it skips the browser login requirement entirely.

Option A: Run via command line

When you run your docker container, add the environment variable flag -e:

Bash

```
docker run -e CLOUDFLARE_API_TOKEN=your_token_here -it your-image-name
```

Option B: Use a .env file (Recommended)

If you are using docker-compose or want to keep it cleaner:

1. Create a `.env` file in your project root (add this file to `.gitignore` so you don't leak secrets!).
    
2. Add the line: `CLOUDFLARE_API_TOKEN=your_token_here`
    
3. Pass it in your `docker-compose.yml`:
    
    YAML
    
    ```
    services:
      app:
        build: .
        environment:
          - CLOUDFLARE_API_TOKEN=${CLOUDFLARE_API_TOKEN}
    ```
    

### Step 3: Verify & Deploy

Now, inside your Docker container, you do **not** need to run `wrangler login`. You can simply run:

Bash

```
# This will now work without asking for a browser
npx wrangler whoami
```

If that returns your account details, you are authenticated. You can proceed directly to:

Bash

```
npx wrangler deploy
```

### Important Configuration Note

Sometimes Wrangler also needs to know which **Account ID** to use if your token has access to multiple accounts. If `wrangler deploy` complains about a missing account ID:

1. Go to your Cloudflare Dashboard URL. The Account ID is the hex string after `.com/` (e.g., `dash.cloudflare.com/abc123456...`).
    
2. Add it to your `wrangler.toml` file:
    
    Ini, TOML
    
    ```
    name = "my-worker"
    account_id = "abc123456789..."
    ```
    

Would you like me to explain how to set up this variable specifically for a CI/CD pipeline like GitHub Actions or GitLab?

Build a Simple API with Cloudflare Workers

This video is relevant because it walks through the wrangler setup process and demonstrates how configuration files and environment variables (like the API token discussed) are used in practice.




My public endpoint: https://winter-shadow-1378.junepixs.workers.dev
