"""LLM service — Gemini integration with graceful fallback."""

import json
import logging
import re

import google.generativeai as genai

from app.schemas.merchant import MerchantMetrics, AIAnalysisResponse
from app.services.prompt_builder import build_analysis_prompt
from app.services.recommendation_engine import identify_risk_factors, generate_fallback_recommendations

logger = logging.getLogger(__name__)


class LLMService:
    """Handles LLM interactions using Google Gemini."""

    def __init__(self, api_key: str, thresholds: dict):
        self.api_key = api_key
        self.thresholds = thresholds
        self.model = None

        if api_key and api_key != "your_gemini_api_key_here":
            try:
                genai.configure(api_key=api_key)
                self.model = genai.GenerativeModel("gemini-2.0-flash")
                logger.info("Gemini LLM initialized successfully.")
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini: {e}. Will use fallback.")
        else:
            logger.info("No Gemini API key provided. Using fallback recommendation engine.")

    async def analyze(
        self,
        health_score: float,
        risk_level: str,
        metrics: MerchantMetrics,
        risk_factors: list[str],
    ) -> AIAnalysisResponse:
        """Generate AI analysis of merchant health.

        Falls back to deterministic engine on any failure.
        """
        if not self.model:
            logger.info("LLM not available, using fallback recommendations.")
            return generate_fallback_recommendations(risk_factors, risk_level)

        try:
            prompt = build_analysis_prompt(health_score, risk_level, metrics, risk_factors)

            response = self.model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.7,
                    max_output_tokens=1024,
                ),
            )

            response_text = response.text.strip()

            # Try to extract JSON from the response
            json_data = self._parse_json_response(response_text)

            return AIAnalysisResponse(
                summary=json_data.get("summary", "Analysis unavailable."),
                risk_factors=json_data.get("risk_factors", risk_factors[:5]),
                recommendations=json_data.get("recommendations", []),
                priority=json_data.get("priority", "medium"),
            )

        except Exception as e:
            logger.error(f"LLM analysis failed: {e}. Using fallback.")
            return generate_fallback_recommendations(risk_factors, risk_level)

    def _parse_json_response(self, text: str) -> dict:
        """Extract and parse JSON from LLM response text."""
        # Try direct parse first
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            pass

        # Try to find JSON in code blocks
        json_match = re.search(r"```(?:json)?\s*\n?(.*?)\n?```", text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1).strip())
            except json.JSONDecodeError:
                pass

        # Try to find JSON object in the text
        brace_match = re.search(r"\{.*\}", text, re.DOTALL)
        if brace_match:
            try:
                return json.loads(brace_match.group(0))
            except json.JSONDecodeError:
                pass

        raise ValueError(f"Could not parse JSON from LLM response: {text[:200]}")
