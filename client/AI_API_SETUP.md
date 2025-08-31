# AI API Setup Guide

## Required Environment Variables

To use the AI analysis features, you need to add the following API keys to your `.env.local` file:

```bash
# OpenAI API Key (for ChatGPT)
OPENAI_API_KEY=your_openai_api_key_here

# Google AI API Key (for Gemini)
GEMINI_API_KEY=your_gemini_api_key_here

# Anthropic API Key (for Claude)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## How to Get API Keys

### 1. OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys" in the sidebar
4. Click "Create new secret key"
5. Copy the generated key

### 2. Google AI API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key

### 3. Anthropic API Key
1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to "API Keys"
4. Click "Create Key"
5. Copy the generated key

## Usage

Once you've added the API keys to your `.env.local` file, the AI analysis feature will be available in the analytics page. Users can:

- Select from ChatGPT, Gemini, or Claude
- Choose analysis types (news, chart, or both)
- Get AI-powered insights about cryptocurrency performance

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your API keys secure and don't share them publicly
- Monitor your API usage to avoid unexpected charges
- Consider implementing rate limiting for production use

## API Limits

- **OpenAI**: Varies by plan, check your usage dashboard
- **Google AI**: Free tier available, check pricing for higher usage
- **Anthropic**: Free tier available, check pricing for higher usage
