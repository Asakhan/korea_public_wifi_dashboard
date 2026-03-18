# 전국 공공 와이파이 설치 현황 대시보드

![Project Preview](https://via.placeholder.com/800x400.png?text=Korea+Public+WiFi+Dashboard)

본 프로젝트는 **한국 공공데이터**를 활용하여 전국 공공 와이파이 설치 현황을 시각화하는 대시보드 웹 서비스입니다. 대학원 과제 제출용으로 제작되었으며, 가장 단순하고 안정적으로 동작하는 구조와 배포 편의성을 목표로 개발되었습니다.

> **데이터 출처**: 공공데이터포털(data.go.kr) 전국 공공와이파이 표준데이터  
> DB 연결 시: Prisma를 통해 저장된 데이터 표시.  
> DB 미연결/비어 있을 시: `data/freewifi_260313.csv`(전국 공공와이파이 CSV)를 사용하여 전국 와이파이 설치 현황 표시.  
> CSV 파일이 없거나 오류 시: `data/public-wifi-sample.json` 샘플 데이터를 Fallback으로 자동 표시. 

---

## 🌟 주요 기능

- **Google OAuth 회원가입·로그인**: Google 계정으로 로그인하면 자동으로 회원가입되며, 곧바로 로그인 상태로 이용 가능
- **대시보드 KPI 카드**: 전국 와이파이 총계, 시/도 통계 등 주요 지표 요약 제공
- **데이터 시각화 (Recharts)**: 지역별 설치 수(Bar Chart) / 시도별 비율(Pie Chart)
- **지도 시각화 (React-Leaflet)**: 전국 와이파이 위치 정보 기반 마커 표시
- **데이터 테이블**: 시/도 필터, 검색, 좌표 표시가 포함된 상세 내역 테이블
- **방명록**: 로그인한 회원이 Google 계정 정보(이름·프로필 이미지)로 방명록 작성 가능. 본인이 작성한 글만 수정·삭제 가능
- **데이터 Fallback**: DB 미사용 시 `data/freewifi_260313.csv` → 실패 시 `data/public-wifi-sample.json` 샘플 데이터로 자동 전환
- **다크 모드 디자인**: 가독성이 높은 대시보드 테마 적용

---

## 🛠 기술 스택

- **Framework**: `Next.js 16` (App Router)
- **Language**: `TypeScript`
- **Styling**: `Tailwind CSS 4.0`
- **Auth**: `Auth.js (NextAuth v5 beta)` (Google Provider)
- **Database**: `Prisma ORM` + PostgreSQL (Vercel Postgres 호환)
- **Charts / Maps**: `Recharts`, `React-Leaflet`
- **Icons**: `Lucide React`

---

## 📂 폴더 구조

```
📦 korea_public_wifi_dashboard
 ┣ 📂 data                    # 정적/Fallback 데이터
 ┃ ┣ 📜 freewifi_260313.csv   # 전국 공공와이파이 설치 현황 (주요 데이터 소스, DB 미사용 시 사용)
 ┃ ┗ 📜 public-wifi-sample.json  # CSV 실패 시 표시되는 샘플 데이터
 ┣ 📂 prisma                  # Prisma ORM 스키마 및 DB Seed
 ┃ ┣ 📜 schema.prisma         # 데이터베이스 테이블 정의 (User, GuestbookEntry, WifiLocation 등)
 ┃ ┗ 📜 seed.ts               # 초기 시드 데이터 생성 스크립트
 ┣ 📂 scripts                 # 데이터 처리 및 배치 스크립트
 ┃ ┗ 📜 fetch-wifi-data.ts    # 공공데이터 초기 셋업용 스크립트
 ┣ 📂 src                     # 소스 코드
 ┃ ┣ 📂 app                   # Next.js App Router (페이지/API)
 ┃ ┃ ┣ 📂 api/guestbook       # 방명록 API (GET/POST, PATCH/DELETE)
 ┃ ┃ ┣ 📂 guestbook           # 방명록 페이지
 ┃ ┃ ┣ 📂 login               # 로그인 페이지
 ┃ ┃ ┗ ...
 ┃ ┣ 📂 components            # Reusable UI 컴포넌트 (SidebarLayout 등)
 ┃ ┣ 📂 lib                   # 유틸리티 (Prisma, get-wifi-data 등)
 ┃ ┗ 📂 types                 # 타입 정의 (next-auth 확장 등)
 ┣ 📜 .env.example            # 환경변수 예시 파일
 ┣ 📜 README.md               # 프로젝트 가이드
 ┗ 📜 ... config files        # 패키지 및 린팅 설정
```

---

## 🚀 실행 방법 (Local Development)

### 1️⃣ 환경변수 설정
프로젝트 루트에 `.env` 파일을 생성하고 `.env.example`의 내용을 참고하여 값을 채워넣습니다.
로컬 데이터베이스 테스트를 원할 시 **PostgreSQL**이 설치되어 있어야 합니다.

```env
# Database Configuration (Vercel Postgres 연결 문자열)
DATABASE_URL="postgresql://user:password@host:port/dbname?schema=public"
DIRECT_URL="postgresql://user:password@host:port/dbname?schema=public"

# NextAuth / Auth.js 설정
AUTH_SECRET="임의의-비밀키를-생성하여-넣어주세요"
AUTH_URL="http://localhost:3000"

# Google OAuth (GCP Console에서 발급된 Client ID/Secret)
AUTH_GOOGLE_ID="your-google-client-id.apps.googleusercontent.com"
AUTH_GOOGLE_SECRET="your-google-client-secret"
```

### 2️⃣ 종속성 설치 및 DB 초기화
```bash
# 1. 패키지 설치 (이전에 Prisma 7을 쓰던 경우, node_modules 삭제 후 실행 권장)
npm install

# 2. Prisma 클라이언트 생성
npx prisma generate

# 3. 데이터베이스 스키마 푸시 (주의: 기존 데이터 초기화됨)
npx prisma db push

# 4. 데이터베이스 마이그레이션 적용 (GuestbookEntry 등 테이블 생성)
npx prisma migrate dev --name init

# 5. 초기 시드 데이터 구축 (선택)
npx tsx prisma/seed.ts
npx tsx scripts/fetch-wifi-data.ts
```

**seed.ts 오류 발생 시** (PrismaClientInitializationError 등):
1. PowerShell에서 `.\scripts\clean-install.ps1` 실행
2. 또는 수동: `Remove-Item -Recurse -Force node_modules; Remove-Item package-lock.json; npm install`
3. `npx prisma generate` → `npx prisma db push` → `npx tsx prisma/seed.ts`

### 3️⃣ 로컬 서버 실행
```bash
npm run dev
# 브라우저에서 http://localhost:3000 접속
```

---

## ☁️ Vercel 배포 방법

본 프로젝트는 Vercel 배포에 최적화되어 있습니다. 아래 순서에 따라 즉시 배포 가능합니다.

1. **Vercel 프로젝트 생성**: GitHub Repository를 Vercel과 연동합니다.
2. **Vercel Postgres 연결**:
   - Vercel Storage 탭에서 **Postgres** 데이터베이스를 생성하고 현재 프로젝트와 연결합니다.
   - `DATABASE_URL`, `DIRECT_URL` 환경 변수가 자동으로 Vercel 환경에 주입됩니다.
3. **환경 변수 추가**:
   - Vercel Settings > Environment Variables 메뉴에 가서 아래 변수들을 직접 등록합니다.
     - `AUTH_SECRET` (임의의 해시 문자열)
     - `AUTH_GOOGLE_ID`
     - `AUTH_GOOGLE_SECRET`
4. **빌드 및 배포 커맨드 설정** (Build Settings):
   - **Build Command**: `npx prisma generate && npx prisma db push && npx tsx prisma/seed.ts && next build`
     > 빌드 시 자동으로 DB 스키마를 업데이트하고 초기 요구 계정을 주입합니다.
   - **참고**: Prisma 5 사용 (어댑터 없이 동작)
5. **배포 시작**: Save를 누르고 배포를 진행하면 서비스가 온라인 상태로 전환됩니다.

---

## 🔑 인증 및 방명록

- **회원가입·로그인**: Google OAuth로 로그인하면 PrismaAdapter를 통해 자동으로 회원 등록 후 로그인됩니다. 별도 Allowlist 없이 Google 계정이면 이용 가능합니다.
- **방명록**: 로그인한 사용자만 방명록 작성 가능하며, 작성 시 Google 계정의 이름·프로필 이미지가 함께 표시됩니다. 각 사용자는 본인이 작성한 글에 한해 수정·삭제할 수 있습니다.
- **이미지 설정**: Google 프로필 이미지 표시를 위해 `next.config.ts`에 `lh3.googleusercontent.com`이 `images.remotePatterns`로 설정되어 있습니다.

---

## 📝 과제 제출 수행 요약

본 프로젝트는 아래의 핵심 요구사항을 충족합니다.
1. **완성도 있는 안정적 구조**: App Router 중심의 인증(Auth.js)과 시각화(Recharts, Leaflet)에 초점을 맞춤.
2. **Google OAuth 회원가입**: 로그인 시 자동 회원가입 및 세션 유지.
3. **방명록 기능**: 메뉴에서 방명록 접근, 로그인 회원의 작성·본인 글 수정/삭제 지원.
4. **Vercel + Postgres 배포 준비**: Prisma 마이그레이션 및 환경 변수 설정으로 배포 가능.
5. **UI/UX**: 다크 모드, KPI 카드, 방명록 UI로 완성도 높은 대시보드 제공.