from django.urls import path
from . import views


urlpatterns = [
    path('current_user/', views.currentUser, name='usersData'),
    path('user/create/', views.userCreate.as_view()),

    path('post/', views.postList, name='postList'),
    path('post/detail/<str:pk/', views.postDetail, name='postDetail'),
    path('post/create/', views.postCreate, name='postCreate'),
    path('post/update/<str:pk>/', views.postUpdate, name='postUpdate'),
    path('post/delete/<str:pk>/', views.postDelete, name='postDelete'),

    path('comment/', views.comments, name='comments'),
    path('comment/create/', views.commentCreate, name='commentCreate'),
    path('comment/delete/<str:pk>/', views.commentDelete, name='commentDelete'),
]