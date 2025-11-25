# Skroutz Vault - Versioning & Deployment Setup

## 🚀 Overview

## 🔗 Key Files

| File                            | Purpose                         |
|---------------------------------|---------------------------------|
| `manifest.json`                 | Version stored here             |
| `CHANGELOG.md`                  | All version history and changes |
| `.github/workflows/release.yml` | GitHub Actions automation       |

## 📦 Release Artifacts

When you push a git tag (e.g., `v1.0.1`):

```
GitHub Release
├── v1.0.1 (Release page)
│   └── skroutz-vault-v1.0.1.zip (Download here!)
│       ├── manifest.json
│       ├── popup.html
│       ├── popup.js
│       ├── content.js
│       ├── background.js
│       ├── icons/
│       ├── README.md
│       ├── LICENSE
│       └── CHANGELOG.md
```

## 🎯 Deployment to Chrome Web Store

1. **Prepare**: Make changes, update version and commit
2. **Tag & Push**: Create git tag with version
3. **Auto-build**: GitHub Actions creates ZIP
4. **Download**: Get ZIP from GitHub Releases
5. **Upload**: Submit ZIP to Chrome Web Store Developer Dashboard

## 📝 Example Workflow

```bash
# Current version: 1.0.0

# 1. Fix a bug
echo "// Bug fix" >> popup.js
git add popup.js
git commit -m "fix: correct search behavior"
git push

# 2. Bump to 1.0.1
# (Edit manifest.json manually)

# 3. Update changelog
# (Edit CHANGELOG.md manually)

# 4. Release
git add manifest.json CHANGELOG.md
git commit -m "chore: bump version to 1.0.1"
git tag v1.0.1
git push origin main --tags

# 5. Done! GitHub Actions creates the ZIP automatically
# → Check GitHub Releases for download link
```

## 🔐 GitHub Actions Requirements

The workflow is already configured to:

- Trigger on any tag starting with `v` (e.g., `v1.0.0`)
- Use `GITHUB_TOKEN` (automatically available)
- Create releases and upload artifacts

No additional secrets or configuration needed!

## ✅ Checklist for Next Release

- [ ] Make code changes and test
- [ ] Update `manifest.json` && `CHANGELOG.md`
- [ ] Commit version changes
- [ ] Create and push git tag
- [ ] Verify GitHub Release created
- [ ] Download ZIP from release
- [ ] Test ZIP on local machine
- [ ] Upload to Chrome Web Store

## 📖 Reference

- **Semantic Versioning**: https://semver.org/
- **Keep a Changelog**: https://keepachangelog.com/
- **Chrome Web Store**: https://chrome.google.com/webstore/devconsole
- **GitHub Actions**: https://github.com/features/actions

## 🆘 Troubleshooting

**Issue**: GitHub Actions not running

- Solution: Verify tag matches `v*` pattern, check GitHub Actions tab for logs

**Issue**: ZIP not created

- Solution: Check workflow file exists at `.github/workflows/release.yml`

---

You're all set! Next release is just 3 commands away. 🎉
