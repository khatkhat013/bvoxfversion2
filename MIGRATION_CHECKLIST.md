# BVOX Finance - Migration Checklist

Complete this checklist to fully migrate your project to the new optimized structure.

## Phase 1: Preparation ✅ (Already Done)

- [x] Create new folder structure
- [x] Create configuration system (`js/config.js`)
- [x] Create utilities library (`js/utils.js`)
- [x] Create development server (`server.js`)
- [x] Create package.json
- [x] Create documentation
- [x] Create start scripts

## Phase 2: Asset Migration 📋 (TODO)

### Copy CSS Files
- [ ] Copy `Bvox_files/style.css` → `css/style.css`
- [ ] Copy `contract_files/layer.css` → `css/layer.css`
- [ ] Copy other CSS files if exist
- [ ] Verify all CSS rules are included
- [ ] Test styling after copy

### Copy Image Files
- [ ] Create `assets/images/` subdirectory
- [ ] Copy all PNG files to `assets/images/`
- [ ] Copy all JPG files to `assets/images/`
- [ ] Copy `favicon.ico` to `assets/`
- [ ] Verify image counts match

### Copy JavaScript Libraries
- [ ] Copy `jquery.js` → `js/jquery.js`
- [ ] Copy `pako.min.js` → `js/pako.min.js`
- [ ] Copy `js.cookie.min.js` → `js/js.cookie.min.js`
- [ ] Copy `web3.min.js` → `js/web3.min.js`
- [ ] Copy `web3provider.js` → `js/web3provider.js`
- [ ] Copy any other library files

### Verify Asset Structure
```
assets/
├── images/
│   ├── banner4.png
│   ├── btc.png
│   ├── eth.png
│   ├── doge.png
│   ├── ... (all other images)
├── icons/
│   ├── (optional: icon files)
└── favicon.ico

css/
├── style.css
├── layer.css
└── (any other CSS files)

js/
├── config.js ✨ NEW
├── utils.js ✨ NEW
├── jquery.js
├── pako.min.js
├── js.cookie.min.js
├── web3.min.js
└── web3provider.js
```

## Phase 3: HTML Migration 📋 (TODO)

### Move HTML Pages
- [ ] Create `pages/` directory
- [ ] Copy `mining.html` → `pages/mining.html`
- [ ] Copy `contract.html` → `pages/contract.html`
- [ ] Copy `ai-arbitrage.html` → `pages/ai-arbitrage.html`
- [ ] Copy `loan.html` → `pages/loan.html`
- [ ] Copy `assets.html` → `pages/assets.html`
- [ ] Copy `exchange.html` → `pages/exchange.html`
- [ ] Copy `coin.html` → `pages/coin.html`
- [ ] Copy `kyc1.html` → `pages/kyc1.html`
- [ ] Copy `kyc2.html` → `pages/kyc2.html`
- [ ] Copy `identity.html` → `pages/identity.html`
- [ ] Copy `financial.html` → `pages/financial.html`
- [ ] Copy `contract-record.html` → `pages/contract-record.html`
- [ ] Copy `exchange-record.html` → `pages/exchange-record.html`
- [ ] Copy `loan-record.html` → `pages/loan-record.html`
- [ ] Copy `topup.html` → `pages/topup.html`
- [ ] Copy `topup-record.html` → `pages/topup-record.html`
- [ ] Copy `send-record.html` → `pages/send-record.html`
- [ ] Copy `ai-plan.html` → `pages/ai-plan.html`
- [ ] Copy `ai-record.html` → `pages/ai-record.html`
- [ ] Copy `telegram.html` → `pages/telegram.html`
- [ ] Copy `service.html` → `pages/service.html`
- [ ] Copy `lang.html` → `pages/lang.html`
- [ ] Copy `license.html` → `pages/license.html`
- [ ] Copy `faqs.html` → `pages/faqs.html`
- [ ] Copy `notify.html` → `pages/notify.html`
- [ ] Copy `out.html` → `pages/out.html`
- [ ] Keep `index.html` in root directory

### Update index.html References
In `index.html`:
- [ ] Update CSS reference: `./Bvox_files/style.css` → `./css/style.css`
- [ ] Update JS references to new paths
- [ ] Update image references to `./assets/images/`
- [ ] Add `<script src="./js/config.js"></script>` (first)
- [ ] Add `<script src="./js/utils.js"></script>` (second)
- [ ] Verify all links work

### Update Pages HTML References
For each page in `pages/`:
- [ ] Update CSS reference: `./Bvox_files/style.css` → `../css/style.css`
- [ ] Update JS references to new paths: `../js/`
- [ ] Update image references to `../assets/images/`
- [ ] Add `<script src="../js/config.js"></script>` (first)
- [ ] Add `<script src="../js/utils.js"></script>` (second)
- [ ] Update navigation links to `../pages/filename.html`
- [ ] Verify all links work

### PowerShell: Automated Update (Optional)

Run this PowerShell script to auto-update references:

```powershell
# Update CSS paths (for pages directory)
Get-ChildItem -Path ".\pages\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace './Bvox_files/style.css', '../css/style.css'
    $content = $content -replace './contract_files/layer.css', '../css/layer.css'
    Set-Content $_.FullName $content
}

# Update JS paths (for pages directory)
Get-ChildItem -Path ".\pages\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace './Bvox_files/jquery.js', '../js/jquery.js'
    $content = $content -replace './Bvox_files/', '../js/'
    Set-Content $_.FullName $content
}

# Update image paths (for pages directory)
Get-ChildItem -Path ".\pages\*.html" | ForEach-Object {
    $content = Get-Content $_.FullName
    $content = $content -replace './Bvox_files/', '../assets/images/'
    $content = $content -replace './assets_files/', '../assets/images/'
    Set-Content $_.FullName $content
}

# Update image paths in root index.html
$content = Get-Content ".\index.html"
$content = $content -replace './Bvox_files/', './assets/images/'
Set-Content ".\index.html" $content
```

## Phase 4: Configuration 📋 (TODO)

### Update API Configuration
- [ ] Edit `js/config.js`
- [ ] Update `API_CONFIG.baseURL` to your API server
- [ ] Test API connectivity

### Update WebSocket Configuration
- [ ] Verify `WS_CONFIG.huobi` is correct
- [ ] Test WebSocket connection
- [ ] Monitor console for connection status

### Create .env File (Optional)
- [ ] Create `.env` file in root
- [ ] Add environment-specific settings
- [ ] Add `.env` to `.gitignore`

## Phase 5: Testing 📋 (TODO)

### Test Development Server
- [ ] Start server: `node server.js`
- [ ] Open http://localhost:3000
- [ ] Verify homepage loads
- [ ] Check browser console for errors

### Test Navigation
- [ ] Click on each navigation link
- [ ] Verify pages load correctly
- [ ] Verify all images display
- [ ] Verify all CSS applies

### Test API Connection
- [ ] Check if API calls work
- [ ] Monitor Network tab in DevTools
- [ ] Verify error handling

### Test WebSocket
- [ ] Check if price data updates
- [ ] Monitor WebSocket messages
- [ ] Verify reconnection works

### Test on Mobile
- [ ] Test on iPhone (iOS)
- [ ] Test on Android phone
- [ ] Verify responsive design
- [ ] Test touch interactions

### Test in Different Browsers
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari (if available)
- [ ] Edge

## Phase 6: Cleanup 📋 (TODO)

### Remove Old Folders
- [ ] Delete or backup `Bvox_files/` (verify nothing is missing first)
- [ ] Delete or backup `mining_files/` (verify nothing is missing first)
- [ ] Delete or backup `contract_files/` (verify nothing is missing first)
- [ ] Delete all other `*_files/` directories
- [ ] Keep backup copy just in case

### Optimize
- [ ] Minify CSS for production
- [ ] Minify JavaScript for production
- [ ] Compress images
- [ ] Remove duplicate files

### Documentation
- [ ] Update README with migration completion
- [ ] Document any custom changes made
- [ ] Add team notes for future developers

## Phase 7: Deployment 📋 (TODO)

### Pre-Deployment
- [ ] Run full test suite
- [ ] Check performance metrics
- [ ] Update README for production
- [ ] Prepare deployment checklist

### Deployment
- [ ] Update API URLs to production
- [ ] Update WebSocket URLs if needed
- [ ] Deploy to production server
- [ ] Monitor for errors

### Post-Deployment
- [ ] Test all features on production
- [ ] Monitor user reports
- [ ] Set up error logging
- [ ] Monitor performance

## Verification Checklist

After completing all phases, verify:

- [ ] All pages load without errors
- [ ] All images display correctly
- [ ] CSS styling is applied correctly
- [ ] JavaScript functionality works
- [ ] API calls are successful
- [ ] WebSocket prices update in real-time
- [ ] User authentication works
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] No 404 errors in Network tab
- [ ] All links navigate correctly
- [ ] Application loads within reasonable time

## Notes

### Common Issues During Migration

**Issue: Images not loading**
- Check path correctness
- Verify images exist in assets/images/
- Check browser cache (Ctrl+Shift+Delete)

**Issue: CSS not applying**
- Verify CSS path is correct
- Check for typos in link tag
- Clear browser cache

**Issue: JavaScript errors**
- Check console (F12)
- Verify script paths
- Check for missing libraries

**Issue: API 404 errors**
- Verify API URL in config.js
- Check if backend is running
- Test API with curl or Postman

## Support Commands

```powershell
# Check project structure
tree /L 3

# Count files in directory
(Get-ChildItem -R).Count

# Find all references to old paths
Select-String -Path "*.html" -Pattern "Bvox_files"

# Find all 404 images in HTML
Select-String -Path "*.html" -Pattern "src=" | Select-String "\.png|\.jpg|\.gif"
```

## Timeline

- **Phase 1**: ✅ Completed (2-3 hours)
- **Phase 2**: 1-2 hours
- **Phase 3**: 2-3 hours
- **Phase 4**: 30 minutes
- **Phase 5**: 2-3 hours
- **Phase 6**: 1 hour
- **Phase 7**: Depends on infrastructure

**Total Estimated Time**: 8-14 hours

## Next Steps After Migration

1. Deploy to production
2. Monitor for issues
3. Gather user feedback
4. Plan performance optimizations
5. Plan new features

---

**Good luck with your migration!** 🚀
