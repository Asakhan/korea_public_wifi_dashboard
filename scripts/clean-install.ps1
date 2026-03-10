# Prisma 5 클린 설치 (PowerShell)
# 기존 Prisma 7과 충돌 시 실행

Write-Host "Removing node_modules and package-lock.json..." -ForegroundColor Yellow
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue

Write-Host "Running npm install..." -ForegroundColor Yellow
npm install

Write-Host "Running prisma generate..." -ForegroundColor Yellow
npx prisma generate

Write-Host "Done. Run: npx prisma db push && npx tsx prisma/seed.ts" -ForegroundColor Green
