# 🧪 Testing Reflexhon v3.0.0 Intelligent System (PowerShell)

## Test 1: Check Datasets Count (Should be 18)

```powershell
$response = Invoke-RestMethod -Uri "https://reflexhon-global.sahidattaf.workers.dev/api/v1/datasets"
Write-Host "Total Datasets: $($response.count)" -ForegroundColor Green
Write-Host "Metadata Source: $($response.metadata.source)" -ForegroundColor Cyan
```

**Expected:** `Total Datasets: 18` (was 10 before)

---

## Test 2: Check Intelligent Chatbot

```powershell
$body = @{
    input = "Kiko ta empatia?"
    context = @{
        language = "papiamentu"
    }
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "https://reflexhon-global.sahidattaf.workers.dev/api/v1/reflexion" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

Write-Host "`n🤖 Model: $($response.data.metadata.model)" -ForegroundColor Green
Write-Host "📊 Layers Processed: $($response.data.metadata.layers_processed)" -ForegroundColor Cyan
Write-Host "📚 Datasets Searched: $($response.data.metadata.datasets_searched)" -ForegroundColor Cyan
Write-Host "🎯 Confidence: $($response.data.confidence)" -ForegroundColor Yellow
Write-Host "`n💬 Response:`n$($response.data.response)" -ForegroundColor White

if ($response.data.matched_dataset) {
    Write-Host "`n✅ Matched Dataset:" -ForegroundColor Green
    Write-Host "   ID: $($response.data.matched_dataset.id)" -ForegroundColor Gray
    Write-Host "   Category: $($response.data.matched_dataset.category)" -ForegroundColor Gray
    Write-Host "   Match Score: $($response.data.matched_dataset.match_score)/100" -ForegroundColor Gray
}

if ($response.data.analysis) {
    Write-Host "`n🔍 Analysis:" -ForegroundColor Green
    Write-Host "   Intent: $($response.data.analysis.intent)" -ForegroundColor Gray
    Write-Host "   Language: $($response.data.analysis.language)" -ForegroundColor Gray
    Write-Host "   Complexity: $($response.data.analysis.complexity)" -ForegroundColor Gray
}
```

**Expected Output:**
```
🤖 Model: reflexhon-v3.0.0-intelligent
📊 Layers Processed: 3
📚 Datasets Searched: 18
🎯 Confidence: 1

💬 Response:
Empatia ta e kapasidat pa sinti loke e otro hende ta sinti...

✅ Matched Dataset:
   ID: papiamentu_001
   Category: emotions
   Match Score: 100/100

🔍 Analysis:
   Intent: question
   Language: papiamentu
   Complexity: simple
```

---

## Test 3: View All Datasets

```powershell
$response = Invoke-RestMethod -Uri "https://reflexhon-global.sahidattaf.workers.dev/api/v1/datasets"

Write-Host "`n📚 All Datasets ($($response.count) total):" -ForegroundColor Green
$response.data | ForEach-Object {
    Write-Host "`n  [$($_.id)] $($_.category)" -ForegroundColor Cyan
    Write-Host "  Q: $($_.input)" -ForegroundColor Gray
    Write-Host "  A: $($_.output.Substring(0, [Math]::Min(100, $_.output.Length)))..." -ForegroundColor White
}
```

---

## Test 4: Test UI in Browser

Open: **https://reflexhon-global.sahidattaf.workers.dev/**

Check:
- [ ] AI Chat tab loads
- [ ] Type "Kiko ta empatia?" and press Send
- [ ] Response appears (not stuck on "Creating Caribbean story...")
- [ ] Datasets tab shows **18 datasets** (not 10)
- [ ] Analytics tab displays without duplicate headers

---

## Quick One-Liner Tests

**Just check if it's working:**
```powershell
# Quick datasets count
(Invoke-RestMethod "https://reflexhon-global.sahidattaf.workers.dev/api/v1/datasets").count

# Quick chatbot test
$r = Invoke-RestMethod -Uri "https://reflexhon-global.sahidattaf.workers.dev/api/v1/reflexion" -Method Post -ContentType "application/json" -Body '{"input":"Kiko ta empatia?"}'
$r.data.metadata.model
```

**Expected:**
```
18
reflexhon-v3.0.0-intelligent
```

---

## What Changed from Previous Version

| Feature | Before (v3.0.0-simple) | After (v3.0.0-intelligent) |
|---------|------------------------|----------------------------|
| **Model** | reflexhon-v3.0.0-simple | reflexhon-v3.0.0-intelligent |
| **Response Method** | Keyword matching | ReflexionEngine analysis |
| **Datasets** | 10 hardcoded | 18 from datasets.js |
| **Layers** | 1 | 3 |
| **Analysis** | None | Intent, entities, cultural context |
| **Confidence** | Fixed 0.92 | Dynamic 0.75-1.0 |
| **Match Scoring** | No | Yes (0-100) |

---

**Bo por kore e test aki awor! 🚀**  
**You can run these tests now! 🚀**
