const express = require('express');
const axios = require('axios');
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config();

// Generate menu using AI
router.post('/generate', async (req, res) => {
  try {
    const { prompt, menuType } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Default to DeepSeek, but allow configuration via env var
    const AI_SERVICE = process.env.AI_SERVICE || 'deepseek'; 
    const API_KEY = process.env.AI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'AI API key not configured' });
    }
    
    // Enhance the prompt with menu type information
    const enhancedPrompt = `Generate a detailed ${menuType || ''} menu with the following requirements: ${prompt}. 
    For each dish, provide:
    1. A descriptive name
    2. A detailed description of ingredients and preparation
    3. Number of people it serves
    
    Format the response as JSON in the following structure:
    {
      "dishes": [
        {
          "name": "Dish Name",
          "description": "Detailed description with ingredients and preparation",
          "numberOfPeople": 4
        }
      ]
    }`;
    
    let responseData;
    
    // Call the appropriate AI service based on configuration
    switch (AI_SERVICE.toLowerCase()) {
      case 'deepseek':
        responseData = await callDeepSeekAPI(enhancedPrompt, API_KEY);
        break;
      case 'claude':
        responseData = await callClaudeAPI(enhancedPrompt, API_KEY);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported AI service' });
    }
    
    res.json(responseData);
  } catch (error) {
    console.error('Error generating menu:', error);
    res.status(500).json({ error: error.message });
  }
});

// Function to call DeepSeek API
async function callDeepSeekAPI(prompt, apiKey) {
  try {
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    
    // Parse the response to extract JSON
    const content = response.data.choices[0].message.content;
    try {
      // Try to extract JSON if response is in code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
        return JSON.parse(jsonStr);
      }
      
      // If we can't extract JSON, return the raw content
      return { rawResponse: content };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return { rawResponse: content };
    }
  } catch (error) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    throw new Error('Failed to generate menu with DeepSeek: ' + (error.response?.data?.error?.message || error.message));
  }
}

// Function to call Claude API
async function callClaudeAPI(prompt, apiKey) {
  try {
    const response = await axios.post(
      'https://api.anthropic.com/v1/messages',
      {
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        }
      }
    );
    
    const content = response.data.content[0].text;
    try {
      // Try to extract JSON if response is in code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                        content.match(/```\n([\s\S]*?)\n```/) || 
                        content.match(/{[\s\S]*?}/);
      
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json\n|```\n|```/g, '');
        return JSON.parse(jsonStr);
      }
      
      // If we can't extract JSON, return the raw content
      return { rawResponse: content };
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return { rawResponse: content };
    }
  } catch (error) {
    console.error('Claude API error:', error.response?.data || error.message);
    throw new Error('Failed to generate menu with Claude: ' + (error.response?.data?.error?.message || error.message));
  }
}

module.exports = router;