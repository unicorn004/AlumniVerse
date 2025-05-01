from flask import Flask, request, jsonify
from flask_cors import CORS  # Added for CORS support
from dotenv import load_dotenv
import os
from typing import Optional, Dict, Any, List
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_groq import ChatGroq
from langchain_core.output_parsers import PydanticOutputParser, StrOutputParser

# Load .env variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

class ModerationOutput(BaseModel):
    decision: int  # 1 = accept, 0 = reject
    reason: str = Field(default="", description="Short reason for rejection. Empty if accepted.")

moderation_prompt = PromptTemplate.from_template("""
You are a strict but fair content moderator for an alumni-student platform. 
You are tasked with ensuring that the platform remains respectful, welcoming, and positive.

Classify the following post as acceptable or not. 
Consider that friendly teasing, jokes, or constructive criticism should not be rejected. 
Just mentioning someone or calling them out in a respectful manner is not grounds for rejection.
Ensure that the post does not contain:
- Personal attacks or insults
- Offensive or discriminatory language
- Harmful content, including threats, hate speech, or harassment

Respond ONLY in JSON format as:
{{"decision": 1 or 0, "reason": "<very short explanation if rejected, only if rejected>"}}.

Post content:
"{post}"
""")

# chatbot_prompt = PromptTemplate.from_template(
#     """You are a chat assistant for an alumni-student networking platform called AlumniVerse. Your job is to ALWAYS respond from the USER'S perspective in first person, as if YOU ARE THE USER speaking to someone else in the chat.

# You will receive a single prompt with some conversation history. You must respond fully and independently to each prompt.

# Current User Profile Information:
# {user_profile}

# Previous Conversation Context:
# {conversation_context}

# User's Prompt: {prompt}

# CRITICAL INSTRUCTIONS:
# 1. ALWAYS respond as if you ARE THE USER speaking in FIRST PERSON ("I", "me", "my").
# 2. NEVER identify yourself as AI, assistant, or chatbot - you ARE the user.
# 3. If profile data is missing/incomplete, use reasonable assumptions about a college graduate to craft your response - NEVER mention missing data.
# 4. Keep responses natural, conversational, and concise (under 150 words).
# 5. For introduction prompts, create a friendly self-introduction using available profile info.
# 6. For factual questions (like "Tell my friend about gravity"), provide an informative response as if the user is explaining the concept themselves, based on common knowledge.
# 7. If the prompt is unclear, make a reasonable interpretation and respond accordingly.
# 8. NEVER suggest to collect more information - work with what you have.
# 9. NEVER use phrases like "As an AI" or "I don't have personal experiences" - respond as a human user would.
# 10. Use the previous conversation context to maintain continuity and provide relevant responses.

# Format your response directly as if the USER is talking to someone else in chat - no framing, no explanations, just the user's words.
# """
# )

chatbot_prompt = PromptTemplate.from_template(
    """You are a chat assistant for an alumni-student networking platform called AlumniVerse. Your job is to ALWAYS respond from the USER'S perspective in first person, as if YOU ARE THE USER speaking to someone else in the chat.

Current User Profile Information (ONLY use when explicitly requested):
{user_profile}

Previous Conversation Context:
{conversation_context}

User's Prompt: {prompt}

CRITICAL INSTRUCTIONS:
1. ALWAYS respond as if you ARE THE USER speaking in FIRST PERSON ("I", "me", "my").
2. NEVER identify yourself as AI, assistant, or chatbot - you ARE the user.
3. BE MINIMALIST - only include information that is directly relevant to the conversation.
4. DO NOT reference or include profile information UNLESS explicitly asked to do so.
5. Keep responses short, natural and conversational (30-60 words) unless more detail is specifically requested.
6. Sound like a real human - avoid overly formal language, avoid excessive enthusiasm, avoid buzzwords.
7. For factual questions (like "Tell my friend about gravity"), provide a brief, down-to-earth explanation.
8. Use the previous conversation context to identify what you're being asked to respond to.
9. If you need to mention your experiences, only do so when explicitly asked to include them.
10. When asked to list skills/experiences, ONLY do so if explicitly asked - don't volunteer this information.
11. Write in a relaxed, casual tone that sounds like texting a friend.
12. Use occasional filler words (um, well, hmm) and simple sentence structures for authenticity.
13. Don't overexplain - be concise and direct.

Format your response directly as if the USER is talking to someone else in chat - no framing, no explanations, just the user's words.
"""
)

moderation_llm = ChatGroq(
    temperature=0,
    model_name="llama3-8b-8192", 
)

chatbot_llm = ChatGroq(
    temperature=0.2,
    model_name="llama3-8b-8192",
)

parser = PydanticOutputParser(pydantic_object=ModerationOutput)
output_parser = StrOutputParser()

moderation_chain = moderation_prompt | moderation_llm | parser
chatbot_chain = chatbot_prompt | chatbot_llm | output_parser

@app.route('/moderate', methods=['POST'])
def moderate_post():
    try:
        # Get JSON data from request
        data = request.get_json()
        
        # Validate that post content is provided
        if not data or 'post' not in data:
            return jsonify({"error": "Post content is required"}), 400
        
        post_content = data['post']
        
        # Run the moderation chain
        result = moderation_chain.invoke({"post": post_content})
        
        # Prepare response
        response = {
            "decision": result.decision,
            "reason": result.reason if result.decision == 0 else "",
            "status": "accepted" if result.decision == 1 else "rejected"
        }
        
        return jsonify(response)
    
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500
      
@app.route('/chatbot', methods=['POST'])
def handle_chatbot_request():
    try:
        # Get JSON data from request
        data = request.get_json(force=True)

        # Validate required fields
        if not data or 'prompt' not in data:
            return jsonify({"error": "Prompt is required"}), 400
        
        prompt = data['prompt']
        user_profile = data.get('user_profile', {})
        messages = data.get('messages', [])
        
        # Format user profile data for the prompt
        formatted_profile = format_user_profile(user_profile)
        # Format conversation context from messages
        formatted_context = format_conversation_context(messages)
        
        #print("prompt = ", prompt)
        #print("user_profile = ", user_profile)
        #print("messages = ", messages)
        
        # Invoke the chatbot chain
        response = chatbot_chain.invoke({
            "prompt": prompt,
            "user_profile": formatted_profile,
            "conversation_context": formatted_context
        })
        
        return jsonify({
            "status": "success",
            "response": response
        })
        
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

def format_conversation_context(messages: List[Dict[str, Any]]) -> str:
    """Format the previous messages into a readable conversation context."""
    if not messages or len(messages) == 0:
        return "No previous conversation."
    
    # Limit to last 20 messages to avoid overwhelming the context window
    recent_messages = messages[-20:] if len(messages) > 20 else messages
    
    formatted_messages = []
    for msg in recent_messages:
        sender = msg.get('senderName', 'Unknown')
        content = msg.get('content', '')
        formatted_messages.append(f"{sender}: {content}")
    
    return "\n".join(formatted_messages)
      
def format_user_profile(profile: Dict[str, Any]) -> str:
    """Format the user profile data into a readable string for the prompt."""
    if not profile:
        return "No profile data available."
    
    formatted = []
    
    # Basic info
    if profile.get('fullName'):
        formatted.append(f"Name: {profile.get('fullName', '')}")
    
    if profile.get('role'):
        formatted.append(f"Role: {profile.get('role', '')}")
    
    if profile.get('bio'):
        formatted.append(f"Bio: {profile.get('bio', '')}")
    
    if profile.get('branch'):
        formatted.append(f"Branch: {profile.get('branch', '')}")
    
    if profile.get('graduationYear'):
        formatted.append(f"Graduation Year: {profile.get('graduationYear', '')}")
    
    if profile.get('location'):
        formatted.append(f"Location: {profile.get('location', '')}")
    
    if profile.get('jobTitle'):
        formatted.append(f"Job Title: {profile.get('jobTitle', '')}")
    
    # Skills
    if profile.get('skills') and len(profile['skills']) > 0:
        formatted.append(f"Skills: {', '.join(profile['skills'])}")
    
    # Experiences
    if profile.get('experiences') and len(profile['experiences']) > 0:
        formatted.append("\nWork Experience:")
        for exp in profile['experiences']:
            exp_str = f"- {exp.get('jobTitle', '')} at {exp.get('company', '')}"
            if exp.get('startYear'):
                exp_str += f" ({exp.get('startMonth', '')} {exp.get('startYear', '')}"
                if exp.get('endYear'):
                    exp_str += f" - {exp.get('endMonth', '')} {exp.get('endYear', '')}"
                elif exp.get('isCurrent'):
                    exp_str += " - Present"
                exp_str += ")"
            if exp.get('description'):
                exp_str += f"\n  {exp.get('description', '')}"
            formatted.append(exp_str)
    
    # Achievements
    if profile.get('achievements') and len(profile['achievements']) > 0:
        formatted.append("\nAchievements:")
        for achievement in profile['achievements']:
            ach_str = f"- {achievement.get('title', '')} ({achievement.get('type', '')}, {achievement.get('year', '')})"
            if achievement.get('description'):
                ach_str += f"\n  {achievement.get('description', '')}"
            formatted.append(ach_str)
    
    # Education
    if profile.get('education') and len(profile['education']) > 0:
        formatted.append("\nEducation:")
        for edu in profile['education']:
            formatted.append(f"- {edu.get('degree', '')} at {edu.get('institution', '')}")
    
    return "\n".join(formatted)

if __name__ == '__main__':
    app.run(debug=True, port=4000)  # Running on port 4000 for local, render doesn't hit here it simply does "gunicorn flask_backend:app"