from rest_framework import permissions


class ActionPermission(permissions.DjangoModelPermissions):
	perms_map = {
		'OPTIONS': ['%(app_label)s.view_%(model_name)s'],
		'HEAD': ['%(app_label)s.view_%(model_name)s'],
		'GET': ['%(app_label)s.view_%(model_name)s'],
		'POST': ['%(app_label)s.add_%(model_name)s'],
		'PUT': ['%(app_label)s.change_%(model_name)s'],
		'PATCH': ['%(app_label)s.change_%(model_name)s'],
		'DELETE': ['%(app_label)s.delete_%(model_name)s'],
	}

	authenticated_users_only = True


def action_permission(method, permission):
	permission_class = ActionPermission

	if type(method) == list:
		perms_map = {}
		for item in method:
			perms_map[item.upper()] = permission
		permission_class.perms_map = perms_map
	else:
		permission_class.perms_map = {
			method.upper(): [permission],
		}
	return [permission_class]
