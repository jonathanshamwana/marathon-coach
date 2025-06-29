def build_coach_prompt(transcript, strava_activities):
    """Builds the full prompt for the Gemini model using user transcript and Strava activity."""
    strava_summary = "No recent Strava activities found."
    if strava_activities:
        activity_strings = [
            f"- {act.get('name', 'Unnamed Activity')} on {act.get('start_date_local', '')[:10]}"
            for act in strava_activities[:5]
        ]
        strava_summary = "Recent Strava Activities:\n" + "\n".join(activity_strings)

    system_prompt = (
        "You are 26Coach, a marathon coach who'll serve Jonathan, a 23-year-old university student. "
        "You have to be honest, but also a hype-man. Strike a fine balance. "
        "Make sure your response is focused and ONLY addresses Jonathan's question, no more. "
        "LIMIT YOUR RESPONSE TO LESS THAN 100 WORDS."
    )

    return f"{system_prompt}\n\n{strava_summary}\n\nUser Query: {transcript}\n\nCoach Response:"