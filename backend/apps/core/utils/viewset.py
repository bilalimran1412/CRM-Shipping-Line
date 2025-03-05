from rest_framework import status, mixins
from rest_framework.viewsets import GenericViewSet
from django.db.models.deletion import ProtectedError
from rest_framework.response import Response


class DestroyModelMixin(object):
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            self.perform_destroy(instance)
        except ProtectedError as e:
            return Response(
                status=status.HTTP_423_LOCKED,
                data={
                    'code': 'protected_error',
                    'detail': 'locked_by_related_objects',
                }
            )
        return Response(status=status.HTTP_204_NO_CONTENT)

    def perform_destroy(self, instance):
        instance.delete()


class BaseModelViewSet(mixins.CreateModelMixin,
                       mixins.RetrieveModelMixin,
                       mixins.UpdateModelMixin,
                       DestroyModelMixin,
                       mixins.ListModelMixin,
                       GenericViewSet):
    pass
