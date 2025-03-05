from core.utils.rest import ModelPermission, CustomPagination
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404
from rest_framework import status, permissions, viewsets
from ..serializers.user import UserSerializer, ProfileSerializer, ChangePasswordSerializer
from ..serializers.group import GroupDetailSerializer
from ..filterset.user import UserFilterSet
from ..models import User
from core.utils.permission import action_permission, ActionPermission
from django.contrib.auth.models import Group

CREATE_FORM_PERMISSION = action_permission('GET', 'user.create_user')
EDIT_FORM_PERMISSION = action_permission('GET', 'user.change_user')


class ProfilePermission(permissions.DjangoModelPermissions):
	perms_map = {
		'GET': ['user.change_profile'],
		'POST': ['user.change_profile'],
	}

	authenticated_users_only = True


class ViewSet(viewsets.ModelViewSet):
	permission_classes = [ModelPermission]
	pagination_class = CustomPagination
	filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
	filterset_class = UserFilterSet
	search_fields = ['username', 'first_name__icontains', 'last_name__icontains']

	serializer_class = UserSerializer

	def get_queryset(self):
		if self.action == 'retrieve':
			pass
		return User.objects.list()

	def get_serializer_class(self):
		if self.action == 'retrieve':
			pass
		return self.serializer_class

	@action(methods=['GET'], detail=False, url_path='form-data', permission_classes=CREATE_FORM_PERMISSION)
	def create_form_data(self, request):
		groups_qs = Group.objects.select_related('extension')
		groups = GroupDetailSerializer(groups_qs, many=True)
		data = {
			"groups": groups.data
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=True, url_path='form-data', permission_classes=EDIT_FORM_PERMISSION)
	def edit_form_data(self, request, pk):
		groups_qs = Group.objects.select_related('extension')
		groups = GroupDetailSerializer(groups_qs, many=True)
		instance = get_object_or_404(User, pk=pk)
		user = UserSerializer(instance, context={"detail": True})
		data = {
			"groups": groups.data,
			"data": user.data,
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='filter-data')
	def filter_form_data(self, request):
		groups_qs = Group.objects.select_related('extension')
		groups = GroupDetailSerializer(groups_qs, many=True)
		data = {
			"groups": groups.data,
		}
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['GET'], detail=False, url_path='profile', permission_classes=[ProfilePermission])
	def profile(self, request):

		data = ProfileSerializer(self.request.user).data
		return Response(data, status=status.HTTP_200_OK)
	@action(methods=['GET'], detail=False, url_path='user-data', permission_classes=[])
	def user_data(self, request):
		data = ProfileSerializer(self.request.user).data
		return Response(data, status=status.HTTP_200_OK)

	@action(methods=['POST'], detail=False, url_path='change-profile', permission_classes=[ProfilePermission])
	def change_profile(self, request):
		user = self.request.user
		if user.id != request.data.get("id"):
			return Response({"detail": "Invalid user ID."}, status=status.HTTP_400_BAD_REQUEST)

		serializer = ProfileSerializer(instance=user, data=request.data, partial=True)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

	@action(methods=['POST'], detail=False, url_path='change-password', permission_classes=[ProfilePermission])
	def change_password(self, request):
		user = self.request.user

		serializer = ChangePasswordSerializer(instance=user, data=request.data, partial=True)
		if serializer.is_valid(raise_exception=True):
			serializer.save()
			return Response(serializer.data, status=status.HTTP_200_OK)
		else:
			return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
