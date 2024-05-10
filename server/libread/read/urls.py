# from django.urls import path
# from.views import ReadView  # Adjust this import if your views are in a different module

# urlpatterns = [
#     path("libread/", ReadView.as_view(), name="read"),
# ]


from django.urls import path
from . import views  # Adjust this import if your views are in a different module

urlpatterns = [
    path("libread/", views.read, name="read"),
]