from django.shortcuts import render, redirect
from .models import SpokenText
from googletrans import Translator

def home(request):
    if request.method == "POST":
        text = request.POST.get("textInput")
        voice = request.POST.get("voiceSelect")
        rate = request.POST.get("rateSelect")
        pitch = request.POST.get("pitchSelect")
        target_lang = request.POST.get("langSelect")

        translator = Translator()
        translated_text = None

        if text:
            try:
                result = translator.translate(text, dest=target_lang or "en")
                translated_text = result.text
            except Exception as e:
                translated_text = "Translation Error"

            SpokenText.objects.create(
                text=text,
                translated_text = translated_text,
                language=target_lang or "en",
                voice=voice if voice else "Default",
                rate=float(rate) if rate else 1.0,
                pitch=float(pitch) if pitch else 1.0
            )
        return redirect("home")

    history = SpokenText.objects.order_by("-created_at")[:10]
    return render(request, "nav/index.html", {"history": history})

