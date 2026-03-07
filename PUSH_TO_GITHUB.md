# Push Code to GitHub - Step by Step

## Step 1: Check Git Status (1 min)

Open PowerShell in your project folder:
```powershell
cd D:\Users\aishwaryaD\ai-hackathon(1)
git status
```

You should see your current branch and modified files.

---

## Step 2: Add All Files (1 min)

Add all your changes:
```powershell
git add .
```

This stages all files for commit.

---

## Step 3: Commit Changes (1 min)

Commit with a message:
```powershell
git commit -m "Add complete tribal language assistant with 7 languages, voice input/output, and 10+ topics"
```

---

## Step 4: Check Remote Repository (1 min)

Check if remote is set:
```powershell
git remote -v
```

You should see:
```
origin  https://github.com/hs-2428/ai-hackathon.git (fetch)
origin  https://github.com/hs-2428/ai-hackathon.git (push)
```

If you see a different repo (awspushstep), update it:
```powershell
git remote set-url origin https://github.com/hs-2428/awspushstep.git
```

---

## Step 5: Push to GitHub (2 min)

Push your code:
```powershell
git push origin main
```

If it asks for credentials:
- Username: **hs-2428**
- Password: Use **Personal Access Token** (not your GitHub password)

### If You Don't Have a Personal Access Token:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Note: **tribal-app-deployment**
4. Check: **repo** (all checkboxes under repo)
5. Click **"Generate token"**
6. **Copy the token** (starts with ghp_...)
7. Use this as password when pushing

---

## Step 6: Verify on GitHub (1 min)

1. Go to: https://github.com/hs-2428/awspushstep
2. Refresh the page
3. You should see all your files uploaded
4. Check that these folders are there:
   - backend/
   - web-app/
   - data/
   - All .md documentation files

---

## Alternative: If Push Fails

If you get errors, try force push (only if you're sure):
```powershell
git push -f origin main
```

Or if branch is different:
```powershell
git branch
git push origin YOUR_BRANCH_NAME
```

---

## What Gets Pushed

✅ **Included:**
- All Lambda functions (backend/lambda/)
- Web app (web-app/)
- Cultural data (data/)
- Documentation files (*.md)
- Configuration files

❌ **Excluded (in .gitignore):**
- node_modules/
- function.zip files
- .env files
- Local cache

---

## After Pushing

Your code is now on GitHub at:
**https://github.com/hs-2428/awspushstep**

Anyone can:
- Clone your repository
- See your code
- Deploy to their own AWS account
- Submit for hackathon

---

## Quick Commands Summary

```powershell
# Navigate to project
cd D:\Users\aishwaryaD\ai-hackathon(1)

# Add all changes
git add .

# Commit
git commit -m "Complete tribal language assistant app"

# Push
git push origin main
```

Done! Your code is on GitHub.
