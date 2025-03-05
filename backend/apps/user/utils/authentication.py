from django.utils.translation import gettext as _
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
import jwt
import datetime
from ..models import Token, TokenLog
from ..serializers.user import UserSerializer


class CustomTokenAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        token = Token.objects.select_related('user').filter(key=key).first()

        if token is None:
            raise AuthenticationFailed(_('Invalid token.'))

        if not token.user.is_active:
            raise AuthenticationFailed(_('User inactive or deleted.'))

        return token.user, token


def sign_in_response(user):
    groups = list(user.groups.values_list('name', flat=True))
    permissions = list(user.get_all_permissions())
    token = Token.objects.create(user=user)
    data = UserSerializer(user).data

    return {
        'permissions': permissions,
        'token': token.key,
        'groups': groups,
        'user': data,
    }


class CustomJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        decoded_token = jwt.decode(raw_token, options={"verify_signature": False})
        user_agent = request.META.get('HTTP_USER_AGENT', None)
        filters = {
            f'{decoded_token["token_type"]}_jti': f'{decoded_token["jti"]}',
            'user_agent': user_agent
        }
        token = Token.objects.filter(**filters)
        if not token.exists():
            return None
        token_instance = token.first()
        if not token_instance.active:
            return None
        token_log = TokenLog.objects.create(token=token_instance, log={
            'REQUEST_METHOD': request.META.get('REQUEST_METHOD', None),
            'PATH_INFO': request.META.get('PATH_INFO', None),
            'QUERY_STRING': request.META.get('QUERY_STRING', None),
            'REMOTE_ADDR': request.META.get('REMOTE_ADDR', None),
            'HTTP_HOST': request.META.get('HTTP_HOST', None),
            'HTTP_USER_AGENT': request.META.get('HTTP_USER_AGENT', None),
            'HTTP_ORIGIN': request.META.get('HTTP_ORIGIN', None),
            'HTTP_REFERER': request.META.get('HTTP_REFERER', None),
            'datetime': datetime.datetime.now().__str__(),
        })

        return self.get_user(validated_token), validated_token