import user from "./user"
import group from "./group"
import profile from "./profile"
import {ICONS} from "../../layouts/dashboard/nav/config-navigation";

const apps = [
  user,
  group,
  profile
]

export const navigation = (checkPermission) => {
  return [
    {
      ignoreSearchbar: true,
      title: 'user.title.navigation',
      path: `/user`,
      icon: ICONS.user,
      permission: checkPermission(perm => perm.includes('user.view')),
      children: [
        ...user.navigation(checkPermission),
        ...group.navigation(checkPermission)
      ],
    },
    ...profile.navigation(checkPermission)
  ]
}
export default apps