# Interview Forge 🚀

**Interview Forge** is a premium, AI-powered interview preparation platform designed to help candidates land their dream jobs. By leveraging **Groq LPU™ technology** and Supabase, it provides personalized question banks, interactive quizzes, and structured study plans with blazing-fast inference speeds.

![Interview Forge](https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=2070)

## ✨ Features

- **🤖 AI Question Bank**: Generate custom interview questions for any role (SWE, PM, Data Science, etc.) and experience level.
- **📝 Interactive MCQ Quizzes**: Test your knowledge with AI-generated multiple-choice questions and get instant feedback.
- **📅 AI Study Plan**: Get a personalized, week-by-week learning schedule tailored to your target role.
- **📊 Progress Tracking**: Monitor your performance, view your session history, and see your accuracy improve over time.
- **🔐 Secure Auth**: Complete authentication system powered by Supabase with OTP verification.
- **🎨 Premium UI**: A modern, responsive design built with React 19, Lucide Icons, and custom CSS.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Vite 8)
- **Styling**: Vanilla CSS (Premium Custom Design)
- **Backend/DB**: Supabase
- **AI Engine**: Groq (Llama 3 70B)
- **Icons**: Lucide React
- **Deployment**: Vercel / Railway

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/malikmajid161/Mock_interviewer.git
cd Mock_interviewer
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GROQ_MODEL=llama3-70b-8192
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Go to your **Supabase SQL Editor** and run the contents of `DATABASE_SETUP.sql`. This will create the necessary tables:
- `profiles`
- `sessions`
- `mcq_attempts`

### 5. Run the app
```bash
npm run dev
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub.
2. Connect your repo to [Vercel](https://vercel.com).
3. Add the environment variables from `.env.local` to the Vercel project settings.
4. Deploy!

## 📄 License

This project is licensed under the MIT License.

---
Built with ❤️ by [Interview Forge Team]
