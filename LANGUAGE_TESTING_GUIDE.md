# 🧪 Language Switching - Testing Guide

## How to Test Language Switching

### Prerequisites
- Browser (Chrome, Firefox, Safari, Edge)
- Website running on http://localhost:3000
- DevTools (F12) for verification

---

## Test 1: Basic Language Switch

### Steps
1. **Open website**
   ```
   http://localhost:3000
   ```

2. **Navigate to language selection**
   - Scroll to footer
   - Click "Select language" / "语言选择" button
   - Should redirect to lang.html

3. **Select English**
   - Click English flag (top-left)
   - Should see "English" label
   - Page redirects to home

4. **Verify English is active**
   - All text should be in English
   - Footer shows "Home", "Assets", "Contract", etc.
   - NOT in Chinese or other language

5. **Go back to language selection**
   - Click footer → "Select language"
   - Notice English is now selected by default

---

## Test 2: Switch to French

### Steps
1. **On language selection page**
   - Click French flag (second option)
   - Should see "Français" label

2. **Verify French translation**
   Expected translations:
   - "Home" → "Accueil"
   - "Assets" → "Actifs"
   - "Contract" → "Contrat"
   - "Loan" → "Prêt"
   - "Mining" → "Exploitation minière"

3. **Check all pages**
   - Click through navigation
   - All pages should be in French
   - Including buttons, labels, menus

---

## Test 3: German Language

### Steps
1. **Select German**
   - Go to lang.html
   - Click German flag (4th option)
   - Verify "Deutsch" appears

2. **Expected translations**
   - "Home" → "Startseite"
   - "Assets" → "Vermögen"
   - "Contract" → "Vertrag"
   - "Loan" → "Darlehen"
   - "Mining" → "Bergbau"

---

## Test 4: Spanish Language

### Steps
1. **Select Spanish**
   - Go to lang.html
   - Click Spanish flag (5th option)

2. **Expected translations**
   - "Home" → "Inicio"
   - "Assets" → "Activos"
   - "Contract" → "Contrato"
   - "Loan" → "Préstamo"

---

## Test 5: Other Languages

### Test Japanese
- Click Japanese flag (7th option)
- Verify: "ホーム", "資産", "契約", etc.

### Test Korean
- Click Korean flag (6th option)
- Verify: "홈", "자산", "계약", etc.

### Test Portuguese
- Click Portuguese flag (5th from left)
- Verify: "Início", "Ativos", "Contrato", etc.

### Test Chinese
- Click Chinese flag (5th option in middle area)
- Verify: "首页", "资产", "合约交易", etc.

### Test Hindi
- Click Hindi flag (last option)
- Verify: "होम", "संपत्ति", "अनुबंध", etc.

---

## Test 6: Cookie Persistence

### Steps
1. **Select French**
   - Go to lang.html
   - Click French flag
   - Verify page is in French

2. **Open DevTools**
   - Press F12
   - Go to "Application" tab
   - Click "Cookies" → "http://localhost:3000"

3. **Verify cookie exists**
   - Should see cookie named: `ylang`
   - Value should be: `fr`
   - Domain: localhost
   - Path: /
   - Expires: (30 days from today)

4. **Reload page**
   - Press F5 or Ctrl+R
   - Page should still be in French
   - ✅ Cookie persistence working!

5. **Navigate to different page**
   - Click on "Assets" / "Actifs"
   - Should still be in French
   - Cookie carried across pages

6. **Close and reopen browser**
   - Close browser completely
   - Open new browser window
   - Go to http://localhost:3000
   - Should still be in French
   - ✅ Long-term persistence working!

---

## Test 7: Language Change Event

### Steps
1. **Open DevTools Console**
   - Press F12
   - Go to "Console" tab

2. **Add event listener**
   ```javascript
   window.addEventListener('languageChanged', function(e) {
       console.log('Language changed to:', e.detail.lang);
   });
   ```

3. **Change language**
   - Go to lang.html
   - Click different language
   - Check console output
   - Should show: "Language changed to: [language_code]"

---

## Test 8: Manual Translation in Console

### Steps
1. **Open DevTools Console**
   - Press F12
   - Go to "Console" tab

2. **Check current language**
   ```javascript
   languageManager.getCurrentLanguage()
   // Should return: 'en', 'fr', 'de', etc.
   ```

3. **Get supported languages**
   ```javascript
   languageManager.getSupportedLanguages()
   // Should return array of all language codes
   ```

4. **Translate text manually**
   ```javascript
   gy('首页')
   // If language='en': returns "Home"
   // If language='fr': returns "Accueil"
   // If language='de': returns "Startseite"
   ```

5. **Set language programmatically**
   ```javascript
   languageManager.setLanguage('es')
   // Page should switch to Spanish
   // Check cookie: ylang should be 'es'
   ```

---

## Test 9: Fallback Translation

### Steps
1. **Test untranslated text**
   - Add new element with untranslated text:
   ```html
   <p data-translate="新的文本">New Text</p>
   ```

2. **Switch language**
   - Go to lang.html
   - Select French
   - Page should still show "New Text"
   - ✅ Fallback working (uses original text)

3. **Add translation**
   - Edit js/lang.js
   - Add to French translations:
   ```javascript
   '新的文本': 'Nouveau texte'
   ```

4. **Reload page**
   - Press F5
   - Should now show "Nouveau texte"
   - ✅ New translation working!

---

## Test 10: Mobile Responsiveness

### Steps
1. **Open DevTools**
   - Press F12
   - Click device toggle (top-left of DevTools)

2. **Select iPhone 12/13**
   - Test language switching
   - Should work on mobile screen size

3. **Select iPad**
   - Test on tablet size
   - Language switching should work

4. **Try different screen sizes**
   - 375px (small phone)
   - 768px (tablet)
   - 1024px (large tablet)
   - All should have working language switching

---

## Test 11: Placeholder Text Translation

### Steps
1. **Check input fields**
   - Go to contract page
   - Find input fields
   - Check placeholder text

2. **Switch language to German**
   - Go to lang.html
   - Click German flag

3. **Verify placeholder text**
   - Input placeholders should update
   - Example: "请输入数量" → "Bitte geben Sie die Menge ein"

---

## Test 12: Performance Test

### Steps
1. **Open DevTools**
   - Press F12
   - Go to "Network" tab

2. **Reload page**
   - Press F5
   - Monitor network requests

3. **Check load times**
   - js/lang.js should load quickly
   - Total page load time should be < 3 seconds
   - No noticeable slowdown

4. **Switch language**
   - Go to lang.html
   - Select different language
   - Should be instant (no loading bar)
   - Confirm performance is good

---

## Test 13: Copy to Clipboard Function

### Steps
1. **On index.html**
   - Look for address or ID to copy
   - Click copy icon/button

2. **Switch language to German**
   - Go to lang.html
   - Select German

3. **Test copy function**
   - Should still work in German
   - No interference with functionality

---

## Test 14: Browser Compatibility

### Chrome
1. Open http://localhost:3000 in Chrome
2. Test all languages
3. Verify cookie storage
4. ✅ Should work perfectly

### Firefox
1. Open http://localhost:3000 in Firefox
2. Test language switching
3. Check DevTools (F12)
4. ✅ Should work perfectly

### Safari (Mac)
1. Open http://localhost:3000 in Safari
2. Test language selection
3. Verify persistence
4. ✅ Should work perfectly

### Edge (Windows)
1. Open http://localhost:3000 in Edge
2. Test all features
3. ✅ Should work perfectly

---

## Test 15: Error Handling

### Step 1: Test invalid language
```javascript
// In console
languageManager.setLanguage('invalid')
// Should fallback to 'en'
// No error shown
```

### Step 2: Test with cookies disabled
1. Open DevTools
2. Settings → "Disable JavaScript"
3. Try language switching
4. Should show message or fallback gracefully

### Step 3: Test missing translations
```html
<!-- Add untranslated text -->
<p data-translate="abc123xyz">Some text</p>
```
- Switch language
- Should show "Some text" (fallback to original)
- No error in console

---

## Quick Verification Checklist

- [ ] Language selection page shows all 9 languages
- [ ] Click each language - page updates instantly
- [ ] Text updates in all visible elements
- [ ] Buttons translate correctly
- [ ] Navigation items translate
- [ ] Cookie is created and persists
- [ ] Page refresh maintains language
- [ ] Browser close/open maintains language (30 days)
- [ ] All pages respect language selection
- [ ] DevTools shows no errors
- [ ] Performance is good (instant switching)
- [ ] Works on mobile screen sizes
- [ ] Works in all browsers
- [ ] Fallback works for untranslated text

---

## Troubleshooting Failed Tests

### Test: Language not changing
**Solution:**
1. Check browser console (F12) for errors
2. Verify js/lang.js loaded (Network tab)
3. Verify languageManager object exists:
   ```javascript
   console.log(languageManager)
   ```
4. Try clearing cache (Ctrl+Shift+Delete)

### Test: Cookie not saving
**Solution:**
1. Verify cookies enabled
2. Check Privacy settings
3. Verify cookie created:
   ```javascript
   console.log(Cookies.get('ylang'))
   ```

### Test: Text showing Chinese after switch
**Solution:**
1. Verify translation exists in js/lang.js
2. Check data-translate attribute matches dictionary key
3. Reload page and try again
4. Check browser console for errors

### Test: Performance is slow
**Solution:**
1. Check Network tab - are all scripts loading?
2. Look for errors in console
3. Verify js/lang.js not too large
4. Check for infinite loops in LanguageManager

---

## Success Indicators

✅ **All Tests Passing**
- Language switches instantly
- All text translates
- Cookie persists for 30 days
- Works on all devices/browsers
- No console errors
- Performance is good
- Fallback works for missing translations

🎉 **Language Switching System is Production Ready!**

---

## Commands for Testing

```bash
# Start server
node server.js

# Open in browser
http://localhost:3000

# Test in Console
languageManager.getCurrentLanguage()
languageManager.setLanguage('fr')
gy('首页')
Cookies.get('ylang')
```

---

**Ready to Test?** 🚀

Follow this guide to thoroughly test the language switching system!
