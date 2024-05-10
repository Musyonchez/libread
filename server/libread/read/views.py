from django.http import HttpResponse


def read(request):
    return HttpResponse("Hello, World!")
