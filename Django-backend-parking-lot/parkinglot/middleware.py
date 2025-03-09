from django.utils import timezone
from .models import PreBookingHistory,Lot

class checkup_clean_expired_prebooking:
    def __init__(self,get_response):
        self.get_response = get_response
    def __call__(self, request):
        curr_time=timezone.now()
        exp_prebooking=PreBookingHistory.objects.all().filter(out_time__lt=curr_time)
        for pb in exp_prebooking:
            id=pb.lot.id
            lot=Lot.objects.all().get(pk=id)
            lot.is_available=True
            lot.save()
            pb.delete()
        response=self.get_response(request)
        return response
         