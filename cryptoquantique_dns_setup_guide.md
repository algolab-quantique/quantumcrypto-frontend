# 🌐 DNS Setup Guide — Full Migration Plan
### `cryptoquantique.app` + `quantumcrypto.app` → New AWS Amplify Frontend

---

## 📌 Current Situation

| | Old Setup | New Setup (Goal) |
|--|-----------|-----------------|
| **Repo** | Old repo | New repo |
| **Amplify App** | Old Amplify app | New Amplify app |
| **Domain 1** | ✅ `quantumcrypto.app` connected & working | 🔜 Migrate here (Phase 2) |
| **Domain 2** | ❌ `cryptoquantique.app` not connected | 🔜 Connect here (Phase 1) |

---

## 🗺️ Full Roadmap Overview

```
PHASE 1 — Connect cryptoquantique.app to NEW Amplify app
──────────────────────────────────────────────────────────
  YOU  →  Create Route 53 Hosted Zone for cryptoquantique.app
  YOU  →  Send 4 nameservers to STI
  STI  →  Update nameservers at domain registrar
  YOU  →  Connect cryptoquantique.app inside NEW Amplify app
  ✅      https://cryptoquantique.app is live!

PHASE 2 — Migrate quantumcrypto.app to NEW Amplify app (do later)
──────────────────────────────────────────────────────────────────
  YOU  →  Remove quantumcrypto.app from OLD Amplify app
  YOU  →  Create Route 53 Hosted Zone for quantumcrypto.app
  YOU  →  Send 4 new nameservers to STI
  STI  →  Update nameservers at domain registrar
  YOU  →  Add quantumcrypto.app inside NEW Amplify app
  ✅      Both domains point to the same new frontend!
```

---

---

# 🔵 PHASE 1 — Connect `cryptoquantique.app`

---

## YOUR Tasks — Phase 1

---

### Step 1 — Create a Hosted Zone in Route 53

1. Go to **AWS Console** → search **Route 53** → open it
2. In the left menu, click **"Hosted zones"**
3. Click the orange button **"Create hosted zone"**
4. Fill in:
   - **Domain name:** `cryptoquantique.app`
   - **Type:** ✅ Public hosted zone
5. Click **"Create hosted zone"**

✅ Route 53 will now show you **4 nameserver (NS) records**. They look like this:

```
ns-123.awsdns-45.com
ns-678.awsdns-90.net
ns-234.awsdns-12.co.uk
ns-567.awsdns-78.org
```

> ⚠️ **Copy these 4 nameservers exactly** — you will send them to STI (see STI section below).

---

### Step 2 — Connect the Domain in AWS Amplify

> ⏳ You can do this in parallel while waiting for STI — Amplify will wait for DNS to propagate.

1. Go to **AWS Console** → search **Amplify** → open it
2. Click on your **NEW Amplify app**
3. In the left menu, click **"Domain management"**
4. Click **"Add domain"**
5. Type `cryptoquantique.app` → click **"Configure domain"**
6. Keep both options:
   - ✅ `cryptoquantique.app` (root domain)
   - ✅ `www.cryptoquantique.app` (recommended)
7. Click **"Save"**

✅ Amplify will automatically:
- Create the correct DNS records in Route 53 (all within AWS ✨)
- Request and install an **SSL certificate** (HTTPS) — no manual action needed
- This process takes **5 to 30 minutes** after DNS propagates

---

### Step 3 — Verify Phase 1

1. **Check DNS propagation** at [https://dnschecker.org](https://dnschecker.org)
   - Enter `cryptoquantique.app` → select record type **NS**
   - You should see the 4 AWS nameservers appearing worldwide 🌍

2. **Check Amplify status** in Domain Management:
   - `SSL certificate` → ✅ Available
   - `Domain activation` → ✅ Active

3. **Visit** `https://cryptoquantique.app` → your site should load! 🎉

---

## STI's Tasks — Phase 1

> 📧 **Copy and send this section to STI as-is. Fill in the 4 nameservers before sending.**

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

> ⏱️ DNS propagation takes between **1 hour and 48 hours** worldwide — this is normal.

---

---

# 🟠 PHASE 2 — Migrate `quantumcrypto.app` to New Amplify App

> ⏳ Do this only after Phase 1 is fully working and confirmed.
> ⚠️ Plan this during **low-traffic hours** (late night or weekend) — there will be a brief downtime.

---

## YOUR Tasks — Phase 2

---

### Step 1 — Remove `quantumcrypto.app` from the OLD Amplify App

> This must be done FIRST to avoid domain conflicts in AWS.

1. Go to **AWS Console** → **Amplify** → open the **OLD Amplify app**
2. Click **"Domain management"**
3. Find `quantumcrypto.app` → click **"Actions"** → **"Delete domain"**
4. Confirm deletion

✅ The old app no longer owns this domain. The site at `quantumcrypto.app` will go down temporarily — this is expected.

---

### Step 2 — Create a Hosted Zone in Route 53 for `quantumcrypto.app`

1. Go to **AWS Console** → **Route 53** → **"Hosted zones"**
2. Click **"Create hosted zone"**
3. Fill in:
   - **Domain name:** `quantumcrypto.app`
   - **Type:** ✅ Public hosted zone
4. Click **"Create hosted zone"**

✅ Copy the **4 new nameservers** that Route 53 gives you — send them to STI (see STI section below).

> ⚠️ These nameservers will be **different** from the ones used in Phase 1 — each Hosted Zone gets its own set.

---

### Step 3 — Add `quantumcrypto.app` to the NEW Amplify App

1. Go to **AWS Console** → **Amplify** → open the **NEW Amplify app**
2. Click **"Domain management"**
3. Click **"Add domain"**
4. Type `quantumcrypto.app` → click **"Configure domain"**
5. Keep both options:
   - ✅ `quantumcrypto.app`
   - ✅ `www.quantumcrypto.app`
6. Click **"Save"**

✅ Amplify handles SSL and DNS records automatically, same as Phase 1.

---

### Step 4 — Verify Phase 2

1. **Check DNS propagation** at [https://dnschecker.org](https://dnschecker.org)
   - Enter `quantumcrypto.app` → select record type **NS**
   - Should show the new AWS nameservers

2. **Check Amplify status** in Domain Management of the NEW app:
   - `cryptoquantique.app` → ✅ Active
   - `quantumcrypto.app` → ✅ Active

3. **Visit both domains** — both should load the same new frontend:
   - `https://cryptoquantique.app` ✅
   - `https://quantumcrypto.app` ✅

---

## STI's Tasks — Phase 2

> 📧 **Copy and send this section to STI when ready for Phase 2. Fill in the 4 new nameservers before sending.**

---

**Subject: Action Required — Update Nameservers for `quantumcrypto.app`**

Hello,

We are migrating the domain `quantumcrypto.app` to our new AWS infrastructure (same process as we did for `cryptoquantique.app`).
We need you to update the **nameservers** for this domain at the registrar.

Please follow the exact same steps as before, but this time for `quantumcrypto.app`:

**1.** Log in to the domain registrar and go to `quantumcrypto.app` domain settings

**2.** Find the **Nameservers** / **DNS** section

**3.** Switch to **Custom nameservers** and replace with these 4 new AWS nameservers:
*(replace with actual values from Step 2 above)*

```
ns-XXX.awsdns-XX.com
ns-XXX.awsdns-XX.net
ns-XXX.awsdns-XX.co.uk
ns-XXX.awsdns-XX.org
```

**4.** Save and confirm back to us

> ⏱️ DNS propagation takes between **1 hour and 48 hours**.
> ⚠️ The site `quantumcrypto.app` will be temporarily down during propagation — this is expected and normal.

---

---

## ❓ FAQ

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
