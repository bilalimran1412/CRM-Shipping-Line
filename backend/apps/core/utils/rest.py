from rest_framework import pagination, permissions
from rest_framework.exceptions import APIException, NotFound
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework.renderers import BrowsableAPIRenderer
from django.core.paginator import EmptyPage


def custom_exception_handler(exc, context):
	print('custom_exception_handler', exc)
	if isinstance(exc, APIException):
		exc.detail = exc.get_full_details()
		return exception_handler(exc, context)
	return exception_handler(exc, context)


class ModelPermission(permissions.DjangoModelPermissions):
	perms_map = {
		'GET': ['%(app_label)s.view_%(model_name)s'],
		'OPTIONS': ['%(app_label)s.view_%(model_name)s'],
		'HEAD': ['%(app_label)s.view_%(model_name)s'],
		'POST': ['%(app_label)s.add_%(model_name)s'],
		'PUT': ['%(app_label)s.change_%(model_name)s'],
		'PATCH': ['%(app_label)s.change_%(model_name)s'],
		'DELETE': ['%(app_label)s.delete_%(model_name)s'],
	}

	authenticated_users_only = True


class CustomPagination(pagination.PageNumberPagination):
	page_size = 15
	page_query_param = 'page'
	page_size_query_param = 'page_size'

	def paginate_queryset(self, queryset, request, view=None):
		self.request = request
		page_size = self.get_page_size(request)
		paginator = self.django_paginator_class(queryset, page_size)

		page_number = request.query_params.get(self.page_query_param, 1)

		try:
			self.page = paginator.page(page_number)
		except EmptyPage:
			self.page = paginator.page(paginator.num_pages)

		if paginator.num_pages > 1 and self.template is not None:
			self.display_page_controls = True

		self.request = request
		self.paginated_queryset = list(self.page)
		return self.paginated_queryset

	def get_paginated_response(self, data):
		# context = getattr(self.request, 'context', {})
		return Response({
			'page': {
				'current': self.page.number,
				'size': self.get_page_size(self.request),
				'previous': self.page.previous_page_number() if self.page.has_previous() else None,
				'next': self.page.next_page_number() if self.page.has_next() else None,
				'count': self.page.paginator.count,
				'total_pages': self.page.paginator.num_pages,
			},
			# 'context': context,
			'results': data
		})


class CustomBrowsableAPIRenderer(BrowsableAPIRenderer):

	def render_form_for_serializer(self, serializer):
		return ""
