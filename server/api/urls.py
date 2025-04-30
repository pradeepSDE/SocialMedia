from django.urls import path, include
from . import views
from accounts.views import RegisterView, LoginView, ConnectionListCreateView, PostListCreateView, UserSearchView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('connections/', ConnectionListCreateView.as_view(), name='connections'),
    path('posts/', PostListCreateView.as_view(), name='posts'),
    path('user-search/', UserSearchView.as_view(), name='user-search'),
]
