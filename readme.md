This app generates bedtime stories using artificial intelligence. The user enters a short text prompt and clicks the "Generate" button. This sends a request to http://localhost:8080/generate, which calls the OpenAI API to generate a full story. The result is then displayed in the frontend.

Once the story is generated, the user can click the "Play" button. This sends the story text to http://localhost:8080/tts, where the backend calls the ElevenLabs API to synthesize speech. The returned audio is immediately played in the browser.

The app lets you create a unique story and listen to it in just a few clicks.
