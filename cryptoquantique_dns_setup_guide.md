# DNS Setup Guide — Full Migration Plan
### `cryptoquantique.app` + `quantumcrypto.app` → New AWS Amplify Frontend

---

## Before You Start — Pre-flight Checklist

- [ ] AWS Console access confirmed (Route 53 + Amplify permissions)
- [ ] You know which Amplify app is **OLD** vs **NEW**
- [ ] STI contact info ready (email / ticket system)
- [ ] Note the **current nameservers** for `quantumcrypto.app` (for rollback safety — see FAQ)
- [ ] Aware that each Route 53 Hosted Zone costs **~$0.50 USD/month**

---

## Why This Guide Exists — Problem Context

STI purchased the domain `cryptoquantique.app` and attempted to connect it to our NEW AWS Amplify app. **It failed** — the domain does not resolve. We **do not have access** to the domain registrar (STI manages that), so we can't diagnose or fix it directly.

What's bizarre is that `quantumcrypto.app` (the OLD domain) **works perfectly** with the old Amplify app. So If it worked before, the same approach should work now. Something went wrong on STI's side — or a step was missed.

---

## DNS Diagnostic Results (checked 2026-03-22)

Here is what DNS lookups reveal about both domains:

### `quantumcrypto.app` — WORKING

| Record Type | Value | Status |
|---|---|---|
| **Nameservers** | `ns1.zonerisq.ca`, `ns2.zonerisq.ca` | Set at registrar |
| **A records** (root) | `3.161.213.51`, `3.161.213.38`, `3.161.213.33`, `3.161.213.4` | 4 CloudFront IPs |
| **CNAME** (`www`) | `d2gt0r9t9hr0tr.cloudfront.net` | Points to CloudFront |
| **HTTPS** | SSL valid, site loads | Working |

### `cryptoquantique.app` — BROKEN

| Record Type | Value | Status |
|---|---|---|
| **Nameservers** | `ns1.zonerisq.ca`, `ns2.zonerisq.ca` | Same registrar (good) |
| **A records** (root) | *(none)* | MISSING — this is the main problem |
| **CNAME** (`www`) | `d1bl2l5c0x7k8y.cloudfront.net` | Exists, but CloudFront doesn't respond |
| **HTTPS** | Connection refused | Not working |

### Root Cause Analysis

The problem is now clear:

1. **Missing A records for the root domain** — STI never added A records for `cryptoquantique.app` (the root/apex). Without A records, the root domain simply doesn't resolve. This is why browsers show "site can't be reached."

2. **www CNAME exists but CloudFront doesn't respond** — STI created a CNAME for `www.cryptoquantique.app` pointing to a CloudFront distribution (`d1bl2l5c0x7k8y.cloudfront.net`), but that distribution either:
   - Doesn't have an **SSL certificate** provisioned for `cryptoquantique.app` (`.app` domains **require** HTTPS — browsers won't even attempt HTTP)
   - The **Amplify domain configuration** was never completed (CloudFront distribution exists but isn't serving the app)
   - The distribution was deleted or misconfigured

3. **Comparison with the working domain** — For `quantumcrypto.app`, STI added **4 A records** (CloudFront IPs) + a working CNAME for `www`. This is exactly the pattern that Amplify expects. For `cryptoquantique.app`, only the `www` CNAME was added — the A records were forgotten or failed.

> **Key insight:** Both domains use the **same registrar** (`zonerisq.ca`) with the **same nameservers**. So the registrar CAN support the needed record types. STI just didn't set them up correctly for `cryptoquantique.app`.

---

## Troubleshooting — How to Fix This

There are **two options**, from cheapest to most robust:

---

### OPTION A — Ask STI to Fix It (Free)

This is the simplest fix — no Route 53 needed, no extra cost. Since the same registrar already works for `quantumcrypto.app`, STI just needs to replicate the same DNS setup.

#### Step 1 — Verify Amplify Domain Configuration

Before asking STI anything, first make sure `cryptoquantique.app` is properly added in your **NEW Amplify app**:

1. Go to **AWS Console** → **Amplify** → open your **NEW Amplify app**
2. Click **"Domain management"**
3. Check if `cryptoquantique.app` is listed there:
   - **If YES:** check the status — is it "Pending verification", "Available", or "Failed"?
   - **If NO:** you need to add it first (see Phase 1, Step 2 below)

> **Critical:** If the domain was never added in Amplify or shows a "Failed" status, the CloudFront distribution and SSL certificate won't exist. STI's DNS records would point to nothing. **Fix this first.**

If the domain shows "Failed":
1. **Delete** the domain from Amplify (Actions → Delete)
2. **Re-add** it: click "Add domain" → type `cryptoquantique.app` → Configure → Save
3. Amplify will show you the **DNS records** you need (A records / CNAME values)
4. **Copy those values** — you'll send them to STI

#### Step 2 — Get the Required DNS Records from Amplify

After adding the domain in Amplify, it will show you exactly which DNS records are needed. Look for:

- **Root domain** (`cryptoquantique.app`): Amplify will provide either **A record IPs** or a **CNAME target** — copy these
- **www subdomain** (`www.cryptoquantique.app`): Amplify will provide a **CNAME target** (a CloudFront URL)
- **SSL validation** CNAME: Amplify may also show a CNAME record needed for certificate validation

#### Step 3 — Send Instructions to STI

**Copy this email, fill in the actual values from Step 2, and send to STI:**

---

**Subject: Fix DNS Records for `cryptoquantique.app` — Missing A Records**

Hello,

The domain `cryptoquantique.app` is not resolving correctly. Our DNS check shows:
- **Root domain** (`cryptoquantique.app`): No A records → site doesn't load
- **www subdomain**: CNAME exists but points to a non-working distribution
- For reference, `quantumcrypto.app` works correctly (same registrar, same setup)

We need you to update the DNS records for `cryptoquantique.app` at the registrar (`zonerisq.ca`). Please add/update these records:

**1. A Records for the root domain** (same approach as `quantumcrypto.app`):
```
Type: A
Name: @ (or cryptoquantique.app)
Value: [FILL IN — IPs from Amplify Domain Management]
```

**2. CNAME for www subdomain:**
```
Type: CNAME
Name: www
Value: [FILL IN — CloudFront URL from Amplify Domain Management]
```

**3. CNAME for SSL certificate validation** (if Amplify shows one):
```
Type: CNAME
Name: [FILL IN — from Amplify]
Value: [FILL IN — from Amplify]
```

> For reference, here is what the WORKING domain `quantumcrypto.app` has:
> - 4 A records: `3.161.213.51`, `3.161.213.38`, `3.161.213.33`, `3.161.213.4`
> - www CNAME: `d2gt0r9t9hr0tr.cloudfront.net`
>
> Please replicate the **same pattern** for `cryptoquantique.app` using the values we provided above.

Thank you!

---

#### Step 4 — Verify After STI Makes Changes

1. Wait **1–48 hours** for DNS propagation
2. Check at [https://dnschecker.org](https://dnschecker.org):
   - `cryptoquantique.app` → type **A** → should show CloudFront IPs
   - `www.cryptoquantique.app` → type **CNAME** → should show CloudFront URL
3. Visit `https://cryptoquantique.app` → should load your app

---

### OPTION B — Use Route 53 (Recommended if Option A fails · ~$1/month)

If Option A doesn't work (STI can't or won't configure the records correctly), Route 53 gives you **full control** over DNS. This is the approach described in the rest of this guide (Phase 1 and Phase 2 below).

**Why Route 53 may still be the better choice:**

| | Option A (STI fixes DNS) | Option B (Route 53) |
|--|--|--|
| **Cost** | Free | ~$0.50/month per domain |
| **Your control** | None — depends on STI for every change | Full control |
| **Speed of changes** | Slow — must ask STI each time | Instant |
| **Risk of misconfiguration** | Higher — STI already got it wrong once | Lower — Amplify auto-configures records |
| **Future maintenance** | Every SSL renewal or change requires STI | Fully automated |

> **Recommendation:** Try Option A first. If it doesn't work within a week, switch to Option B (Route 53). The $1/month is worth the peace of mind and independence.

> **Third alternative:** Ask STI to give you direct access to the domain registrar account at `zonerisq.ca`, so you can configure DNS records yourself without waiting for them. This is free and gives you control, but you'd still be managing DNS outside AWS.

---

## Current Situation

| | Old Setup | New Setup (Goal) |
|--|-----------|-----------------:|
| **Repo** | Old repo | New repo |
| **Amplify App** | Old Amplify app | New Amplify app |
| **Domain 1** | `quantumcrypto.app` connected & working | Migrate here (Phase 2) |
| **Domain 2** | `cryptoquantique.app` not connected | Connect here (Phase 1) |

---

## Full Roadmap Overview

```
PHASE 1 — Connect cryptoquantique.app to NEW Amplify app
──────────────────────────────────────────────────────────
  YOU  →  Create Route 53 Hosted Zone for cryptoquantique.app
  YOU  →  Send 4 nameservers to STI
  STI  →  Update nameservers at domain registrar
  YOU  →  Connect cryptoquantique.app inside NEW Amplify app
        https://cryptoquantique.app is live!

PHASE 2 — Migrate quantumcrypto.app to NEW Amplify app (do later)
──────────────────────────────────────────────────────────────────
  YOU  →  Remove quantumcrypto.app from OLD Amplify app
  YOU  →  Delete OLD Route 53 Hosted Zone for quantumcrypto.app (if exists)
  YOU  →  Create NEW Route 53 Hosted Zone for quantumcrypto.app
  YOU  →  Send 4 new nameservers to STI
  STI  →  Update nameservers at domain registrar
  YOU  →  Add quantumcrypto.app inside NEW Amplify app
        Both domains point to the same new frontend!
```

---

# PHASE 1 — Connect `cryptoquantique.app`

---

## YOUR Tasks — Phase 1

---

### Step 1 — Create a Hosted Zone in Route 53

> **First:** Check if a Hosted Zone for `cryptoquantique.app` already exists in Route 53. If it does, use it — **do not create a duplicate**. Duplicate hosted zones cause DNS conflicts and cost extra.

1. Go to **AWS Console** → search **Route 53** → open it
2. In the left menu, click **"Hosted zones"**
3. Verify that `cryptoquantique.app` is **not** already listed
4. Click the orange button **"Create hosted zone"**
5. Fill in:
   - **Domain name:** `cryptoquantique.app`
   - **Type:** Public hosted zone
6. Click **"Create hosted zone"**

Route 53 will now show you **4 nameserver (NS) records**. They look like this:

```
ns-123.awsdns-45.com
ns-678.awsdns-90.net
ns-234.awsdns-12.co.uk
ns-567.awsdns-78.org
```

> **Copy these 4 nameservers exactly** — you will send them to STI (see STI section below).

---

### Step 2 — Connect the Domain in AWS Amplify

> You can do this in parallel while waiting for STI — Amplify will wait for DNS to propagate.

1. Go to **AWS Console** → search **Amplify** → open it
2. Click on your **NEW Amplify app**
3. In the left menu, click **"Domain management"**
4. Click **"Add domain"**
5. Type `cryptoquantique.app` → click **"Configure domain"**
6. Keep both options:
   - `cryptoquantique.app` (root domain)
   - `www.cryptoquantique.app` (recommended)
7. Click **"Save"**

Amplify will automatically:
- Create the correct DNS records in Route 53 (all within AWS)
- Request and install an **SSL certificate** (HTTPS) — no manual action needed
- This process takes **5 to 30 minutes** after DNS propagates

---

### Step 3 — Verify Phase 1

1. **Check DNS propagation** at [https://dnschecker.org](https://dnschecker.org)
   - Enter `cryptoquantique.app` → select record type **NS**
   - You should see the 4 AWS nameservers appearing worldwide

2. **Check Amplify status** in Domain Management:
   - `SSL certificate` → Available
   - `Domain activation` → Active

3. **Visit** `https://cryptoquantique.app` → your site should load!

> **Tip:** If the site doesn't load immediately, try flushing your local DNS cache:
> ```bash
> # macOS
> sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
> ```
> Also try a hard refresh in your browser (`Cmd + Shift + R`).

---

## STI's Tasks — Phase 1

> **Copy and send this section to STI as-is. Fill in the 4 nameservers before sending.**

---

**Subject: Action Required — Update Nameservers for `cryptoquantique.app`**

Hello,

We are connecting the domain `cryptoquantique.app` to our new AWS infrastructure.
We need you to update the **nameservers** for this domain at the registrar where it was purchased.

Please follow these steps:

**1. Log in to the domain registrar**
- Go to the platform where `cryptoquantique.app` was registered
- Navigate to the domain management page for `cryptoquantique.app`

**2. Find the Nameserver settings**
- Look for a section called **"Nameservers"**, **"DNS"**, or **"Name Servers"**
- It may be under **"Advanced DNS"** or **"Domain Settings"**

**3. Switch to Custom Nameservers**
- Select **"Custom nameservers"** or **"Use custom DNS"**
- Do NOT use the registrar's default nameservers

**4. Enter these 4 AWS nameservers** *(replace with actual values from Step 1 above)*

```
ns-XXX.awsdns-XX.com
ns-XXX.awsdns-XX.net
ns-XXX.awsdns-XX.co.uk
ns-XXX.awsdns-XX.org
```

**5. Save the changes**
- Click Save / Confirm
- If you receive a confirmation email from the registrar, please approve it

**6. Confirm back to us**
- Once saved, please let us know so we can verify on our end

> DNS propagation takes between **1 hour and 48 hours** worldwide — this is normal.

---

# PHASE 2 — Migrate `quantumcrypto.app` to New Amplify App

> Do this only after Phase 1 is fully working and confirmed.
> Plan this during **low-traffic hours** (late night or weekend) — there will be a brief downtime.

---

## YOUR Tasks — Phase 2

---

### Step 1 — Record the Current Nameservers (Rollback Safety)

Before making any changes, note the **current nameservers** for `quantumcrypto.app`:

1. Go to [https://dnschecker.org](https://dnschecker.org)
2. Enter `quantumcrypto.app` → select record type **NS**
3. **Write down / screenshot** the current nameservers

> Keep these safe — if anything goes wrong, STI can revert to these values.

---

### Step 2 — Remove `quantumcrypto.app` from the OLD Amplify App

> This must be done FIRST to avoid domain conflicts in AWS.

1. Go to **AWS Console** → **Amplify** → open the **OLD Amplify app**
2. Click **"Domain management"**
3. Find `quantumcrypto.app` → click **"Actions"** → **"Delete domain"**
4. Confirm deletion

The old app no longer owns this domain. The site at `quantumcrypto.app` will go down temporarily — this is expected.

---

### Step 3 — Delete the OLD Hosted Zone for `quantumcrypto.app` (if it exists)

> If an old Hosted Zone for `quantumcrypto.app` exists in Route 53, **delete it** before creating a new one. Having two Hosted Zones for the same domain causes conflicts and costs double.

1. Go to **AWS Console** → **Route 53** → **"Hosted zones"**
2. Check if `quantumcrypto.app` is listed
3. If yes: click on it → select all records **except** the NS and SOA records → delete them → then delete the Hosted Zone itself
4. If no: skip to Step 4

---

### Step 4 — Create a NEW Hosted Zone in Route 53 for `quantumcrypto.app`

1. Go to **AWS Console** → **Route 53** → **"Hosted zones"**
2. Click **"Create hosted zone"**
3. Fill in:
   - **Domain name:** `quantumcrypto.app`
   - **Type:** Public hosted zone
4. Click **"Create hosted zone"**

Copy the **4 new nameservers** that Route 53 gives you — send them to STI (see STI section below).

> These nameservers will be **different** from the ones used in Phase 1 — each Hosted Zone gets its own set.

---

### Step 5 — Add `quantumcrypto.app` to the NEW Amplify App

> Wait **~5 minutes** after deleting the domain from the old Amplify app (Step 2) before proceeding. AWS needs a moment to fully release the domain association internally.

1. Go to **AWS Console** → **Amplify** → open the **NEW Amplify app**
2. Click **"Domain management"**
3. Click **"Add domain"**
4. Type `quantumcrypto.app` → click **"Configure domain"**
5. Keep both options:
   - `quantumcrypto.app`
   - `www.quantumcrypto.app`
6. Click **"Save"**

Amplify handles SSL and DNS records automatically, same as Phase 1.

---

### Step 6 — Verify Phase 2

1. **Check DNS propagation** at [https://dnschecker.org](https://dnschecker.org)
   - Enter `quantumcrypto.app` → select record type **NS**
   - Should show the new AWS nameservers

2. **Check Amplify status** in Domain Management of the NEW app:
   - `cryptoquantique.app` → Active
   - `quantumcrypto.app` → Active

3. **Visit both domains** — both should load the same new frontend:
   - `https://cryptoquantique.app`
   - `https://quantumcrypto.app`

> **Tip:** Flush your DNS cache and hard-refresh if you see stale content (see Phase 1, Step 3).

---

## STI's Tasks — Phase 2

> **Copy and send this section to STI when ready for Phase 2. Fill in the 4 new nameservers before sending.**

---

**Subject: Action Required — Update Nameservers for `quantumcrypto.app`**

Hello,

We are migrating the domain `quantumcrypto.app` to our new AWS infrastructure (same process as we did for `cryptoquantique.app`).
We need you to update the **nameservers** for this domain at the registrar.

Please follow these steps:

**1. Log in to the domain registrar**
- Go to the platform where `quantumcrypto.app` was registered
- Navigate to the domain management page for `quantumcrypto.app`

**2. Find the Nameserver settings**
- Look for a section called **"Nameservers"**, **"DNS"**, or **"Name Servers"**
- It may be under **"Advanced DNS"** or **"Domain Settings"**

**3. Switch to Custom Nameservers**
- Select **"Custom nameservers"** or **"Use custom DNS"**
- Replace with these **4 new AWS nameservers:** *(replace with actual values from Step 4 above)*

```
ns-XXX.awsdns-XX.com
ns-XXX.awsdns-XX.net
ns-XXX.awsdns-XX.co.uk
ns-XXX.awsdns-XX.org
```

**4. Save the changes**
- Click Save / Confirm
- If you receive a confirmation email from the registrar, please approve it

**5. Confirm back to us**
- Once saved, please let us know so we can verify on our end

> DNS propagation takes between **1 hour and 48 hours**.
> The site `quantumcrypto.app` will be temporarily down during propagation — this is expected and normal.

---

## Rollback Plan

If something goes wrong during Phase 2 and `quantumcrypto.app` remains down for too long:

1. **Re-add `quantumcrypto.app`** to the **OLD Amplify app** (Domain Management → Add domain)
2. **Ask STI** to revert the nameservers to the **old values** you saved in Step 1
3. **Delete** the new Route 53 Hosted Zone for `quantumcrypto.app` (to avoid confusion)
4. Wait for DNS propagation (1–48 hours) — the old setup will be restored

> This is why recording the old nameservers before starting Phase 2 is important!

---

## FAQ

**Q: Will `.app` domains work with AWS?**
> Yes! `.app` forces HTTPS (HSTS preload list), but Amplify handles SSL automatically — no problem at all.

**Q: Can one Amplify app serve two different domain names?**
> Yes — AWS Amplify fully supports multiple custom domains on a single app. Both `cryptoquantique.app` and `quantumcrypto.app` can point to the same new frontend.

**Q: What if it still doesn't work after 48 hours?**
> Check [dnschecker.org](https://dnschecker.org) for NS records. If they still don't show AWS nameservers, STI may not have saved correctly. If they do show AWS, check the Amplify Domain Management panel for error messages.

**Q: Do we need to create DNS records manually in Route 53?**
> No — Amplify creates all necessary records automatically when you connect the domain. This is the advantage of using Route 53 + Amplify together inside AWS.

**Q: What happens to the old Amplify app after Phase 2?**
> It can be kept for dev/testing or deleted entirely. It will simply no longer serve either domain.

**Q: How much does this cost?**
> Each Route 53 Hosted Zone costs **$0.50 USD/month**. With two domains, that's **$1.00/month** total for DNS hosting. DNS query charges are negligible at low traffic volumes (~$0.40 per million queries).

**Q: What if I accidentally created a duplicate Hosted Zone?**
> Delete the extra one immediately. Go to Route 53 → Hosted Zones, find the duplicate, remove any non-default records, then delete the zone. Only one Hosted Zone per domain should exist.
