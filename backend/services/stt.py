from google.cloud import speech

def transcribe_audio(file_storage):
    """Takes an audio blob and transcribes it with Google's speech-to-text API"""
    try:
        content_type = file_storage.content_type
        audio_bytes = file_storage.read()

        if 'webm' in content_type:
            encoding = speech.RecognitionConfig.AudioEncoding.WEBM_OPUS
        elif 'wav' in content_type:
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
        elif 'ogg' in content_type:
            encoding = speech.RecognitionConfig.AudioEncoding.OGG_OPUS
        else:
            encoding = speech.RecognitionConfig.AudioEncoding.ENCODING_UNSPECIFIED

        config = speech.RecognitionConfig(
            encoding=encoding,
            language_code="en-GB"
        )

        if encoding == speech.RecognitionConfig.AudioEncoding.LINEAR16:
            config.sample_rate_hertz = 16000

        audio = speech.RecognitionAudio(content=audio_bytes)
        client = speech.SpeechClient()
        response = client.recognize(config=config, audio=audio)

        if response.results and response.results[0].alternatives:
            return response.results[0].alternatives[0].transcript

        return None

    except Exception as e:
        print(f"STT Error: {e}")
        return None