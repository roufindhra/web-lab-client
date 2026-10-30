# Developer and Architecture Guide

Karena sudah terlalu sering kita semua kebolak-balik antar project dan antar aplikasi, maka dibuatlah dokumentasi ini sebagai acuan developer untuk membangun, mengembangkan, dan (nantinya?) memelihara lab-sgg-client milik Laboratorium SUrvei Geodesi dan Geometri UPNVY.

## Tech Stack

lab_sgg-client dibangun berbasis React 19, Vite, Tailwind v4, dan TypeScript.
| App | Version |
| React | 19.2.x |
| Vite | 8.2.x |
| TypeScript | ~6.0.2 (strict mode) |
| React Router DOM | 7.18.x |
| Tailwind CSS | v4.3.x |

Digunakan juga Radix UI components, `clsx`, dan `tailwind-merge`

## Naming Convention

Konsistensi penamaan file penting banget nget agar struktur proyek tidak kacau balau ketika website ini semakin berkembang. Mohon untuk dipertahikan:

### 1. Penamaan *file* dan *directory*

- React Components dan Pages menggunakan PascalCase (mis. ServiceCard.tsx, RequestDetailModal.tsx, ClientDashboard.tsx)
- Custom Hooks menggunakan camelCase (mis. useAuthSession.ts, useRequestStatus.ts)
- Utilities, services, dan file helper menggunakan kebab-case (mis. format-date.ts, api-client.ts, cn.ts)
- Types dan interface pakai PascalCase (mis. SurveyRequest.ts, UserRole.ts)

### 2. Struktur component

Setiap komponen yang membutuhkan file terpisah disarankan menggunakan struktur berikut:
    
components/
└── rich-text-editor/
    ├── RichTextEditor.tsx
    ├── EditorToolbar.tsx
    └── useEditorState.ts

## Version Control dan Git Convention

Gunakan penamaan berikut agar riwayat versi, commit, dan branch jelas serta mudah dilacak demi hajat hidup orang banyak.

### 1. Branch

main/
├── fix/
├── feat/
├── refractor/
├── style/
└── docs/

(ingyah kita tidak punya primary integration branch; semua langsung ke main)

Di mana masing-masing <type> adalah:

1. fix: perbaikan *bug*
2. feat: penambahan fitur baru
3. refractor: restrukturisasi kode tanpa mengubah fungsionalitas
4. style: perubahan UI atau styling (CSS, tailwind, MD3 tokens) tanpa mengubah logic
5. docs: perubahan dokumentasi (README.md atau komentar di kode)


### 2. Commit message

Format penulisan commit adalah `<type>(<scope>): <short summary>`

- fix(client): resolve laout overflow on mobile viewport
- feat(client): tambahan Radix select dropdown di formulir request alat
- refractor(client): extract cn helper using clsx and tailwind-merge
- style(client): update MD3 primary color tokens in tokens.css
- docs: update git branching guidelines in README

## Quick Start for New Developers

Untuk bergabung mengembangkan dan maintain project web-lab-client ini:

1. Clone repository

`git clone https://github.com/roufindhra/web-lab-client.git`
`cd web-lab-client/`

2. Install dependencies

`npm install`

3. Run development server

`npm run dev`
