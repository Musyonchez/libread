from django.urls import path
from . import views  # Adjust this import if your views are in a different module

urlpatterns = [
    path("libread/", views.libread, name="libread"),
]
