# Tuinuane App

## Overview

Tuinuane App is a modern web application built with Next.js, designed to provide a seamless user experience with robust backend services and AI capabilities. It leverages Supabase for database and authentication, and integrates with Google Generative AI for intelligent features.

## Features

*   **User Authentication**: Secure user login and registration powered by Supabase.
*   **AI Integration**: Utilizes Google Generative AI for enhanced functionalities.
*   **Responsive Design**: Built with Radix UI and Tailwind CSS for a mobile-first and accessible interface.
*   **API Endpoints**: Includes various API routes for different services.
*   **Portfolio Management**: Dedicated section for managing user portfolios.
*   **Pricing and Services**: Clear presentation of available services and pricing.
*   **Contact Form**: Easy communication channel for users.

## Technology Stack

*   **Framework**: Next.js 16.2.6
*   **Styling**: Tailwind CSS, Radix UI
*   **Backend/Database**: Supabase (SSR and JS client)
*   **AI**: Google Generative AI (v0.24.1)
*   **State Management/Data Fetching**: Tanstack React Query (v5.100.14)
*   **UI Components**: Radix UI, Shadcn UI
*   **Animation**: Framer Motion (v12.40.0)
*   **Charting**: Recharts (v3.8.1)
*   **Email Service**: Resend (v6.12.4)

## Installation and Setup

To get started with the Tuinuane App, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/jasper-nyambichu/tuinuane-app.git
    cd tuinuane-app
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

3.  **Set up environment variables**:
    Create a `.env.local` file in the root directory and add your Supabase and Google Generative AI credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    GOOGLE_GENERATIVE_AI_API_KEY=your_google_generative_ai_api_key
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000 ) with your browser to see the result.

## Project Structure


