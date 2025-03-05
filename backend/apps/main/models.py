from django.db import models
from core.models import BaseModel
from simple_history.models import HistoricalRecords
from django.core.files.uploadedfile import InMemoryUploadedFile
from PIL import Image
from io import BytesIO
from mimetypes import MimeTypes
import uuid

MATH_TYPE = [
    ('division', 'division'),
    ('multiplication', 'multiplication')
]


class File(BaseModel):
    file = models.FileField()
    type = models.CharField(max_length=255, null=True, blank=True)
    thumb = models.FileField(upload_to='thumbnails/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.file:
            # Check if the file is an image
            mime = MimeTypes()
            mime_type, _ = mime.guess_type(self.file.name)
            if mime_type and mime_type in ['image/jpeg', 'image/png']:
                self.create_thumbnail()
        super(File, self).save(*args, **kwargs)

    def create_thumbnail(self):
        if not self.file:
            self.thumb = None
            return

        self.thumb.save(
            self.file.name,
            self.get_thumbnail_file(self.file),
            save=False,
        )

    @staticmethod
    def get_thumbnail_file(photo):
        image = Image.open(photo)
        image.thumbnail((150, 150))
        image_file = BytesIO()
        image.save(image_file, image.format)
        image_file.seek(0)  # Reset the stream to the beginning
        mime = MimeTypes()
        mime_type = mime.guess_type(photo.name)
        return InMemoryUploadedFile(
            image_file,
            None,
            photo.name,
            mime_type[0],
            image_file.tell(),
            None,
        )


class OneTimeLink(BaseModel):
    file = models.ForeignKey(File, on_delete=models.CASCADE)
    token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    is_active = models.BooleanField(default=True)


class Currency(BaseModel):
    name = models.CharField(max_length=50)
    code = models.CharField(max_length=3, unique=True)
    icon = models.ForeignKey('File', on_delete=models.PROTECT, null=True, blank=True)

    history = HistoricalRecords()

    def __str__(self):
        return self.code


class CurrencyRate(BaseModel):
    base = models.ForeignKey('Currency', related_name='base', on_delete=models.PROTECT)
    target = models.ForeignKey('Currency', related_name='target', on_delete=models.PROTECT)
    rate = models.DecimalField(max_digits=20, decimal_places=2)
    math_type = models.CharField(choices=MATH_TYPE, max_length=20)

    history = HistoricalRecords()

    class Meta:
        unique_together = ('base', 'target')

    def __str__(self):
        return f"{self.base} to {self.target} = {self.rate}"


class AppConfig(BaseModel):
    primary_currency = models.OneToOneField(Currency, on_delete=models.PROTECT, blank=True, null=True)

    history = HistoricalRecords()
