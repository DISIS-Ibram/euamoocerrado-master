from rest_framework import permissions

class CurupiraPermission(permissions.BasePermission):
    """
    Global permission check for blacklisted IPs.
    """

    def has_permission(self, request, view):
        #if request.method in ['GET','POST', 'HEAD', 'OPTIONS']:
        return True

    def has_object_permission(self, request, view, obj):
        print(view,request.method)
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            print('entropy')
        return True    