# from django.urls import path
# from.views import ReadView  # Adjust this import if your views are in a different module

# urlpatterns = [
#     path("libread/", ReadView.as_view(), name="read"),
# ]


from django.urls import path
from read import views

urlpatterns = [
    path('translate/', views.get, name='translate'),
]
