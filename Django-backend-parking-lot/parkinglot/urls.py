from django.urls import path,include
from . import views
from rest_framework import routers
router=routers.SimpleRouter()
router.register("lots",views.LotView,basename="lots")
router.register("parkinghistory",views.ParkingHistoryView,basename="parkinghistory")
router.register("prebookinghistory",views.PreBookingHistoryView,basename="prebookinghistory")
urlpatterns = [
    path("",include(router.urls)),
    path("getlots/",views.getLotsView.as_view(),name="getlots"),
    path("assignlot/",views.AssignLotView.as_view(),name="assignlot"),
    path("releaselot/",views.ReleaseLotView.as_view(),name="releaselot"),
    path("prebooking/",views.PreBookView.as_view(),name="prebooking"),
    path("prebooking/cancel/",views.CancelBookingView.as_view(),name="prebooking_cancel"),
]
