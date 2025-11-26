from django.db import models

class SpokenText(models.Model):
    text = models.TextField(default="Default text")
    translateed_text = models.TextField(blank=True, null=True)
    language=models.CharField(max_length=200, default="en")
    voice = models.CharField(max_length=200, blank=True, null=True)   # e.g. "Google UK English Male"
    rate = models.FloatField(default=1.0)  # Speech speed
    pitch = models.FloatField(default=1.0) # Speech pitch
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.text[:30]}... ({self.language})"


