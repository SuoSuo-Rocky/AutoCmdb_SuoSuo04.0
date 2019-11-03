from django.conf.urls import url, include
from web.views import account
from django.urls import path
urlpatterns = [
    path('cmdb.html',account.AutoCmdb.as_view()),
    url(r'^index.html$', account.AutoIndex.as_view()),
    path('asset_manager',account.AutoAddr.as_view(),{"target": "/asset.html"}),
    path('asset.html',account.test),
    path('business_manager',account.AutoAddr.as_view(),{'target': "/business.html"}),
    path('business.html',account.business),
    path('user_manager',account.AutoAddr.as_view(),{'target': 'user.html'}),
    path('user.html',account.user),
    path('shiwei',account.shiwei),
]