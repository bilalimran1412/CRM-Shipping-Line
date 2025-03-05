from ..serializers.user import UserSerializer


def get_user_data(user, request):
    user_data = UserSerializer(user)
    user_data = {
        **user_data.data,
        'permissions': user.get_all_permissions(),
    }
    return user_data
