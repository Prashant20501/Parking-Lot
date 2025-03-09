from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from .models import Lot,ParkingHistory,PreBookingHistory
from django.utils import timezone

class ParkingManagementTests(APITestCase):
    def setUp(self):
        self.admin_user=User.objects.create_superuser('admin','admin@gm.com','123')
        self.normal_user=User.objects.create_user('user','user@gm.com','123')
        self.lot_tw=Lot.objects.create(type='TW',is_available=True, level=1)
        self.lot_fw=Lot.objects.create(type='FW',is_available=True, level=1)
        
    def test_get_lots_regular_user(self):
        self.client.login(username='user', password='123')
        response = self.client.get('/parkinglot/getlots/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['TW'],'available')
        self.assertEqual(response.data['FW'],'available')
    
    def test_get_lots_admin(self):
        self.client.login(username='admin',password='123')
        response=self.client.get('/parkinglot/getlots/')
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertEqual(response.data['TW'],1)
        self.assertEqual(response.data['FW'],1)

    def test_assign_lot(self):
        self.client.login(username='admin',password='123')
        data={
            'vehicle_number':'111',
            'vehicle_type':'TW',
            'level':1
        }
        response=self.client.post('/parkinglot/assignlot/',data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertFalse(Lot.objects.get(pk=self.lot_tw.id).is_available)

    def test_assign_lot_no_space(self):
        self.client.login(username='admin',password='123')
        self.lot_fw.is_available=False
        self.lot_fw.save()
        data = {
            'vehicle_number':'111',
            'vehicle_type':'FW',
            'level':1
        }
        response = self.client.post('/parkinglot/assignlot/',data)
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_release_lot(self):
        self.client.login(username='admin',password='123')
        history = ParkingHistory.objects.create(
            vehicle_number='111',
            vehicle_type='TW',
            lot=self.lot_tw,
            level=1,
            in_time=timezone.now()-timezone.timedelta(hours=1)
        )
        data = {
            'vehicle_number': '111',
            'lot': self.lot_tw.pk
        }
        response=self.client.post('/parkinglot/releaselot/',data)
        self.assertEqual(response.status_code,status.HTTP_200_OK)
        self.assertTrue(Lot.objects.get(pk=self.lot_tw.id).is_available)

    def test_prebook_lot(self):
        self.client.login(username='user',password='123')
        data={
            'vehicle_number':'111',
            'vehicle_type':'TW',
            'level':1,
            'in_time':timezone.now()+timezone.timedelta(minutes=2),
            'out_time':timezone.now()+timezone.timedelta(hours=2)
        }
        response=self.client.post('/parkinglot/prebooking/', data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Lot.objects.get(pk=self.lot_tw.id).is_available)

    def test_cancel_prebooking(self):
        self.client.login(username='user',password='123')
        prebooking = PreBookingHistory.objects.create(
            vehicle_number='111',
            vehicle_type='TW',
            lot=self.lot_tw,
            user=self.normal_user,
            level=1,
            in_time=timezone.now()+timezone.timedelta(minutes=2),
            out_time=timezone.now()+timezone.timedelta(hours=2),
            fee=100
        )
        response=self.client.post('/parkinglot/prebooking/cancel/')
        self.assertTrue(Lot.objects.get(pk=prebooking.lot.id).is_available)
        self.assertFalse(PreBookingHistory.objects.filter(pk=prebooking.pk).exists())
