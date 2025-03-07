from core.utils.serializers import BaseModelSerializer
from user.models import User
from main.serializers.file import FileSerializer


class CustomerSerializer(BaseModelSerializer):
	class Meta:
		model = User
		fields = (
			'id', 'first_name', 'last_name', 'full_name',
		)
