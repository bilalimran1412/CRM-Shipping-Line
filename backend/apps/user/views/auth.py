from rest_framework.generics import GenericAPIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
import jwt
from ..models import *
from ..serializers.auth import *
from ..utils.user import get_user_data


class LoginAPI(GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        refresh_ = jwt.decode(str(refresh).encode('utf-8'), options={"verify_signature": False})['jti']
        access_ = jwt.decode(str(access_token).encode('utf-8'), options={"verify_signature": False})['jti']
        user_agent = request.META.get('HTTP_USER_AGENT', 'None')
        ip_address = request.META.get('REMOTE_ADDR', None)
        token = Token.objects.create(
            user=user,
            refresh_jti=refresh_,
            access_jti=access_,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        return Response({
            "user": get_user_data(user, request),
            'refresh': str(refresh),
            'access': str(access_token),
        }, status=status.HTTP_200_OK)


class RegisterAPI(GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        refresh_ = jwt.decode(str(refresh).encode('utf-8'), options={"verify_signature": False})['jti']
        access_ = jwt.decode(str(access_token).encode('utf-8'), options={"verify_signature": False})['jti']
        user_agent = request.META.get('HTTP_USER_AGENT', 'None')
        ip_address = request.META.get('REMOTE_ADDR', None)
        token = Token.objects.create(
            user=user,
            refresh_jti=refresh_,
            access_jti=access_,
            user_agent=user_agent,
            ip_address=ip_address,
        )
        return Response({
            "user": get_user_data(user, request),
            'refresh': str(refresh),
            'access': str(access_token),
        }, status=status.HTTP_201_CREATED)


class AccountAPI(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "user": get_user_data(self.request.user, request)
        }, status=status.HTTP_200_OK)
