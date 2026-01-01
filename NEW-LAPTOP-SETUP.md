# 🖥️ New Laptop Setup Guide for LANDFORM Architecture Website

This guide will help you set up everything needed to run this project on a new laptop.

---

## 📦 Step 1: Install Required Software

### 1.1 Install Node.js (Required)
Download and install **Node.js LTS** (v20.x or later):
- Go to: https://nodejs.org/
- Download the **LTS** version (Windows Installer)
- Run the installer with default settings

**Verify installation** by opening Command Prompt/PowerShell and running:
```bash
node --version
npm --version
```

### 1.2 Install Git (Recommended)
Download and install Git:
- Go to: https://git-scm.com/download/win
- Run the installer with default settings

**Verify installation:**
```bash
git --version
```

### 1.3 Install VS Code (Recommended)
Download and install Visual Studio Code:
- Go to: https://code.visualstudio.com/
- Download and run the installer

---

## 🧩 Step 2: Install VS Code Extensions

Open VS Code and install these extensions (press `Ctrl+Shift+X` to open Extensions):

### Essential Extensions:
| Extension | ID | Purpose |
|-----------|-----|---------|
| **ESLint** | `dbaeumer.vscode-eslint` | JavaScript/TypeScript linting |
| **Prettier** | `esbenp.prettier-vscode` | Code formatting |
| **Tailwind CSS IntelliSense** | `bradlc.vscode-tailwindcss` | Tailwind autocomplete |
| **TypeScript** | Built-in | TypeScript support |

### Recommended Extensions:
| Extension | ID | Purpose |
|-----------|-----|---------|
| **ES7+ React Snippets** | `dsznajder.es7-react-js-snippets` | React code snippets |
| **Auto Rename Tag** | `formulahendry.auto-rename-tag` | Auto rename HTML tags |
| **Path Intellisense** | `christian-kohler.path-intellisense` | File path autocomplete |
| **Material Icon Theme** | `PKief.material-icon-theme` | Better file icons |
| **Error Lens** | `usernamehw.errorlens` | Show errors inline |

### Quick Install Command:
You can install extensions via command line. Open Command Prompt and run:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension dsznajder.es7-react-js-snippets
code --install-extension formulahendry.auto-rename-tag
code --install-extension christian-kohler.path-intellisense
code --install-extension PKief.material-icon-theme
code --install-extension usernamehw.errorlens
```

---

## 🚀 Step 3: Project Setup Commands

### 3.1 Navigate to Project Folder
Open Command Prompt/PowerShell and navigate to the project:
```bash
cd C:\Users\YourUsername\path\to\architecture-website
```

### 3.2 Install Dependencies
Run this command to install all project dependencies:
```bash
npm install
```
This will install all packages listed in package.json.

### 3.3 Create Environment File
Create a `.env.local` file in the project root with your Supabase credentials:

```bash
# Create the file manually or use VS Code
```

Add these lines to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these values:**
1. Go to https://supabase.com and log in
2. Select your project
3. Go to **Settings** > **API**
4. Copy the values:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### 3.4 Run the Development Server
```bash
npm run dev
```

The website will be available at: **http://localhost:3000**

---

## 📋 Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Check code for errors |

---

## 🗄️ Step 4: Database Setup (Supabase)

If you're using a new Supabase account:

1. Create a new project at https://supabase.com
2. Go to **SQL Editor** in the dashboard
3. Copy the contents of `complete-database-setup.sql` (in project root)
4. Paste and run the SQL script
5. Create storage buckets:
   - Go to **Storage** > **New bucket**
   - Create: `images`, `projects`, `office-gallery`, `logos` (all Public)
6. Create an admin user:
   - Go to **Authentication** > **Users** > **Add user**

---

## 🔧 Troubleshooting

### Issue: "npm is not recognized"
- Node.js is not installed or not in PATH
- Reinstall Node.js and restart Command Prompt

### Issue: "Module not found" errors
- Run `npm install` again
- Delete `node_modules` folder and `.next` folder, then run `npm install`

### Issue: Supabase connection errors
- Check `.env.local` has correct values
- Make sure there are no extra spaces in the env file
- Restart the dev server after changing env variables

### Issue: Port 3000 already in use
- Close other applications using port 3000
- Or run on a different port: `npm run dev -- -p 3001`

---

## 📱 Tech Stack Summary

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.1.0 | React framework |
| React | 18.3.1 | UI library |
| TypeScript | 5.3.0 | Type safety |
| Tailwind CSS | 3.3.6 | Styling |
| Supabase | 2.89.0 | Backend & Database |
| Framer Motion | 12.23.26 | Animations |
| Lucide React | 0.562.0 | Icons |

---

## ✅ Checklist

- [ ] Node.js installed
- [ ] Git installed (optional)
- [ ] VS Code installed
- [ ] VS Code extensions installed
- [ ] Project dependencies installed (`npm install`)
- [ ] `.env.local` file created with Supabase credentials
- [ ] Database tables created in Supabase
- [ ] Storage buckets created in Supabase
- [ ] Development server running (`npm run dev`)

---

**Happy Coding! 🎉**
